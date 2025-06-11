from celery import shared_task
import subprocess
import tempfile
import os
import sys  # Import sys for sys.executable
import uuid  # To generate unique container names


@shared_task
def execute_code(code, language):
    language = language.lower()
    output = ""
    image_name = ""
    interpreter_command_in_container = ""
    file_extension = ""

    # Define language-specific details
    if language == "python":
        image_name = "python-executor"
        interpreter_command_in_container = ""  # ENTRYPOINT handles this
        file_extension = "py"
    elif language == "javascript":
        image_name = "nodejs-executor"
        interpreter_command_in_container = ""  # ENTRYPOINT handles this
        file_extension = "js"
    elif language == "ruby":
        image_name = "ruby-executor"
        interpreter_command_in_container = ""  # ENTRYPOINT handles this
        file_extension = "rb"
    else:
        return f"Language '{language}' is not supported yet."

    # Create a temporary directory and file on the HOST system
    # This file will then be mounted into the Docker container
    with tempfile.TemporaryDirectory() as temp_dir:
        host_file_path = os.path.join(temp_dir, f"script.{file_extension}")
        container_file_path = (
            f"/app/script.{file_extension}"  # Path inside the container
        )

        with open(host_file_path, "w") as f:
            f.write(code)

        # Construct the Docker run command
        # sys.executable ensures 'docker' command is found if it's in the PATH of the venv
        docker_command = [
            # Ensure Docker executable is found
            "docker",
            "run",
            "--rm",  # Automatically remove the container after it exits
            "--network",
            "none",  # IMPORTANT: Disable network access for security
            f"--memory=128m",  # Limit memory to 128MB
            f"--cpus=0.5",  # Limit CPU usage to 50% of one core
            # Optional but recommended for stricter sandboxing:
            # "--read-only", # Make the container's filesystem read-only (except mounted volumes)
            # "--cap-drop=ALL", # Drop all Linux capabilities (more secure)
            # Mount the host file into the container at the specified path
            "-v",
            f"{host_file_path}:{container_file_path}",
            # The image to use
            image_name,
            # The command to execute inside the container (interpreter is ENTRYPOINT, so just script path)
            container_file_path,
        ]

        try:
            # Execute the Docker command
            # The timeout here applies to the *entire Docker container execution*
            result = subprocess.run(
                docker_command,
                capture_output=True,
                text=True,
                timeout=40,  # Example: 10 seconds timeout for container execution
            )
            output = result.stdout if result.returncode == 0 else result.stderr

        except subprocess.TimeoutExpired:
            # If the Docker container itself times out (e.g., infinite loop in user code)
            output = (
                f"Execution timed out (limit: 10 seconds). Your code took too long."
            )
            # Optionally, if you know the container is still running, you could try to stop it here:
            # subprocess.run(["docker", "kill", container_name], capture_output=True)
        except FileNotFoundError:
            output = (
                "Docker command not found. Is Docker Desktop running and in your PATH?"
            )
        except Exception as e:
            output = f"An error occurred during Docker execution: {str(e)}"

    return output
