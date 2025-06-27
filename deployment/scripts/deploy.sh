
#!/bin/bash

# Deployment script for Clinichub Care with Zoho Vault integration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="/var/www/projects/clinichub"
SERVICE_NAME="clinichub-care"

echo "Starting deployment with Zoho Vault integration..."

# Check if Zoho Vault token is set
if [ -z "$ZOHO_VAULT_TOKEN" ]; then
    echo "Error: ZOHO_VAULT_TOKEN environment variable is not set"
    exit 1
fi

# Stop the service
echo "Stopping $SERVICE_NAME service..."
sudo systemctl stop $SERVICE_NAME

# Create backup of current jar
if [ -f "$PROJECT_DIR/api/clinichub-api.jar" ]; then
    echo "Creating backup of current jar..."
    sudo cp "$PROJECT_DIR/api/clinichub-api.jar" "$PROJECT_DIR/api/clinichub-api.jar.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copy new jar file
echo "Copying new jar file..."
sudo cp "$SCRIPT_DIR/../target/clinichub-api.jar" "$PROJECT_DIR/api/"

# Update systemd service file
echo "Updating systemd service file..."
sudo cp "$SCRIPT_DIR/systemd/clinichub-care.service" "/etc/systemd/system/"

# Set environment variable for systemd
echo "Setting up environment for systemd..."
sudo mkdir -p /etc/systemd/system/clinichub-care.service.d/
sudo tee /etc/systemd/system/clinichub-care.service.d/override.conf > /dev/null <<EOF
[Service]
Environment="ZOHO_VAULT_TOKEN=$ZOHO_VAULT_TOKEN"
EOF

# Reload systemd and restart service
echo "Reloading systemd and starting service..."
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

# Wait for service to start
echo "Waiting for service to start..."
sleep 10

# Health check
echo "Performing health check..."
for i in {1..30}; do
    if curl -f http://localhost:8080/api/health/vault; then
        echo "Service is healthy!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "Health check failed after 30 attempts"
        sudo journalctl -u $SERVICE_NAME --lines=50
        exit 1
    fi
    
    echo "Attempt $i failed, retrying in 2 seconds..."
    sleep 2
done

echo "Deployment completed successfully!"
echo "Service status:"
sudo systemctl status $SERVICE_NAME --no-pager
