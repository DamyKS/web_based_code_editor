from celery import shared_task
import subprocess
import tempfile
import os
import json


@shared_task
def execute_code(code, language):
    """
    Execute code in different programming languages

    Supported languages:
    - python
    - javascript (via Node.js)
    - ruby
    """
    language = language.lower()
    # Create a temporary directory to work in
    with tempfile.TemporaryDirectory() as temp_dir:
        # Handle different languages
        if language == "python":
            file_path = os.path.join(temp_dir, "script.py")
            with open(file_path, "w") as f:
                f.write(code)

            try:
                result = subprocess.run(
                    ["python", file_path], capture_output=True, text=True, timeout=5
                )
                output = result.stdout if result.returncode == 0 else result.stderr
            except subprocess.TimeoutExpired:
                output = "Execution timed out (limit: 5 seconds)"
            except Exception as e:
                output = f"Error executing Python code: {str(e)}"

        elif language == "javascript":
            print("js callled ")
            file_path = os.path.join(temp_dir, "script.js")
            with open(file_path, "w") as f:
                f.write(code)

            try:
                result = subprocess.run(
                    ["node", file_path], capture_output=True, text=True, timeout=5
                )
                output = result.stdout if result.returncode == 0 else result.stderr
            except subprocess.TimeoutExpired:
                output = "Execution timed out (limit: 5 seconds)"
            except FileNotFoundError:
                output = "Node.js is not installed or not found in PATH"
            except Exception as e:
                output = f"Error executing JavaScript code: {str(e)}"

        elif language == "ruby":
            file_path = os.path.join(temp_dir, "script.rb")
            with open(file_path, "w") as f:
                f.write(code)

            try:
                result = subprocess.run(
                    ["ruby", file_path], capture_output=True, text=True, timeout=5
                )
                output = result.stdout if result.returncode == 0 else result.stderr
            except subprocess.TimeoutExpired:
                output = "Execution timed out (limit: 5 seconds)"
            except FileNotFoundError:
                output = "Ruby is not installed or not found in PATH"
            except Exception as e:
                output = f"Error executing Ruby code: {str(e)}"

        else:
            output = f"Language '{language}' is not supported yet."

    return output
