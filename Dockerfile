FROM python:3.12-slim

WORKDIR /app
COPY asl /app/asl

ENV PYTHONUNBUFFERED=1
EXPOSE 8765

CMD ["python", "/app/asl/server.py"]
