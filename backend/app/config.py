from typing import List
import os
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', case_sensitive=True, extra='ignore')

    DATABASE_URL: str = 'postgresql://user:password@localhost:5432/autoparts'
    API_TITLE: str = 'AutoPartsPro API'
    API_VERSION: str = '0.1.0'
    API_DESCRIPTION: str = "Backend API for Kenya's automotive parts e-commerce platform"
    SECRET_KEY: str = Field(default='change-me-in-production', min_length=16)
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, ge=5, le=1440)
    CORS_ORIGINS: List[str] = ['http://localhost:3000', 'http://localhost:8000']
    MPESA_CONSUMER_KEY: str = ''
    MPESA_CONSUMER_SECRET: str = ''
    MPESA_PASSKEY: str = ''
    MPESA_BUSINESS_SHORTCODE: str = ''
    MPESA_ENVIRONMENT: str = 'sandbox'

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value


settings = Settings()
