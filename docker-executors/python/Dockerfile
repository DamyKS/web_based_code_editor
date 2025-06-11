# Use a very small base image for Python, like Alpine Linux
FROM python:3.10-slim-bullseye

# Set the working directory inside the container
WORKDIR /app

# (Optional) If your Python scripts might need any external non-standard packages
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# The ENTRYPOINT defines the default command to run when the container starts.
# We want it to be 'python', so any command line arguments after the image name
# will be passed directly to Python (e.g., 'python script.py')
ENTRYPOINT ["python"]

# (Optional, but good practice for security) Create a non-root user
# User ID 1000 is common for non-root users in Linux
# RUN adduser --disabled-password --gecos "" --shell /bin/sh appuser
# USER appuser

# Expose no ports unless explicitly needed (for security)