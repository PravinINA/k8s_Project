# Use the official Python image as the base image
FROM python:3.9-slim
# Set the working directory in the container
WORKDIR /app

RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*
# Copy the Python dependencies file to the container

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add -

RUN wget -qO- https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN apt-get update && ACCEPT_EULA=Y   apt-get install -y msodbcsql18
# optional: for bcp and sqlcmd
RUN apt-get update && ACCEPT_EULA=Y   apt-get install -y mssql-tools18
ENV PATH="$PATH:/opt/mssql-tools18/bin"


# Clean up
RUN rm -rf /var/lib/apt/lists/*
COPY requirement.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirement.txt

# Copy the Flask application code to the container
#COPY . .
COPY src src


#RUN python3 -m venv venv

# Expose the port the Flask application will run on
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 \
               CMD curl -f http://localhost:5000/health || exit 1
ENTRYPOINT [ "python", "./src/app.py"]

# Command to run the Flask application when the container sarts
#CMD ["python", "app.py"]
#CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0"]


##########################################################################################
##########################################################################################
#FROM gcr.io/distroless/python3

#copy the compiled binrary from the build stage
#COPY --from=build /app /appl
#ENTRYPOINT ["/appl"]
