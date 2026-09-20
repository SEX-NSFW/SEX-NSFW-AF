FROM python:3.12-slim

WORKDIR /app
COPY asl /app

ENV PYTHONUNBUFFERED=1
EXPOSE 8765

CMD ["python", "/app/server.py"]
