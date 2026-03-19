import redis
import json
import uuid
from datetime import datetime
from typing import Dict, Optional
import os

class RedisQueue:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0,
            decode_responses=True
        )
        self.job_prefix = "ai_job:"
        self.queue_name = "ai_processing_queue"
    
    def enqueue_job(self, job_type: str, data: Dict) -> str:
        """
        Add a job to the processing queue.
        
        Args:
            job_type: Type of AI job (wetland_detection, bird_detection, risk_prediction)
            data: Job data/parameters
            
        Returns:
            Job ID
        """
        job_id = str(uuid.uuid4())
        
        job_data = {
            "job_id": job_id,
            "job_type": job_type,
            "data": data,
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "retries": 0,
            "max_retries": 3
        }
        
        # Store job data
        self.redis_client.setex(
            f"{self.job_prefix}{job_id}",
            3600,  # 1 hour TTL
            json.dumps(job_data)
        )
        
        # Add to queue
        self.redis_client.lpush(self.queue_name, job_id)
        
        return job_id
    
    def get_job_status(self, job_id: str) -> Optional[Dict]:
        """
        Get the status of a job.
        
        Returns:
            Job data dictionary or None if not found
        """
        job_data = self.redis_client.get(f"{self.job_prefix}{job_id}")
        if job_data:
            return json.loads(job_data)
        return None
    
    def mark_job_processing(self, job_id: str):
        """Mark a job as currently processing"""
        job_data = self.get_job_status(job_id)
        if job_data:
            job_data['status'] = 'processing'
            job_data['started_at'] = datetime.now().isoformat()
            self.redis_client.setex(
                f"{self.job_prefix}{job_id}",
                3600,
                json.dumps(job_data)
            )
    
    def mark_job_complete(self, job_id: str, result: Dict):
        """Mark a job as completed with results"""
        job_data = self.get_job_status(job_id)
        if job_data:
            job_data['status'] = 'completed'
            job_data['completed_at'] = datetime.now().isoformat()
            job_data['result'] = result
            self.redis_client.setex(
                f"{self.job_prefix}{job_id}",
                7200,  # 2 hours TTL for completed jobs
                json.dumps(job_data)
            )
    
    def mark_job_failed(self, job_id: str, error: str):
        """Mark a job as failed"""
        job_data = self.get_job_status(job_id)
        if job_data:
            job_data['status'] = 'failed'
            job_data['failed_at'] = datetime.now().isoformat()
            job_data['error'] = error
            job_data['retries'] += 1
            
            # Retry if under max retries
            if job_data['retries'] < job_data['max_retries']:
                job_data['status'] = 'pending'
                self.redis_client.lpush(self.queue_name, job_id)
            
            self.redis_client.setex(
                f"{self.job_prefix}{job_id}",
                3600,
                json.dumps(job_data)
            )
    
    def dequeue_job(self) -> Optional[str]:
        """
        Get the next job from the queue.
        
        Returns:
            Job ID or None if queue is empty
        """
        job_id = self.redis_client.rpop(self.queue_name)
        return job_id
    
    def get_queue_length(self) -> int:
        """Get the number of jobs in the queue"""
        return self.redis_client.llen(self.queue_name)
