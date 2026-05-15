#!/bin/bash

# Stackfolio Memory Monitor and Auto-Cleanup Script
# Prevents Docker crashes due to memory exhaustion

set -e

MEMORY_THRESHOLD=80  # Alert when memory usage exceeds 80%
CLEANUP_THRESHOLD=90  # Auto-cleanup when memory usage exceeds 90%
LOG_FILE="/tmp/stackfolio-memory.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to get system memory usage
get_memory_usage() {
    memory_percent=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    echo "$memory_percent"
}

# Function to get Docker memory usage
get_docker_memory() {
    docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | tail -n +2
}

# Function to cleanup Docker resources
cleanup_docker() {
    log "🧹 Starting Docker cleanup..."
    
    # Stop and remove unused containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log "✅ Docker cleanup completed"
}

# Function to restart lightweight services if needed
restart_lightweight() {
    log "🔄 Restarting with ultra-lightweight configuration..."
    
    # Stop all running containers
    docker-compose -f docker-compose.yml down 2>/dev/null || true
    docker-compose -f docker-compose-lightweight.yml down 2>/dev/null || true
    
    # Start ultra-lightweight configuration
    docker-compose -f docker-compose-ultra-light.yml up -d
    
    log "✅ Restarted with ultra-lightweight configuration"
}

# Function to check and optimize containers
optimize_containers() {
    log "🔍 Checking container memory usage..."
    
    # Get containers using excessive memory
    high_memory_containers=$(docker stats --no-stream --format "{{.Container}}:{{.MemPerc}}" | grep -E ":[8-9][0-9]\.%|:[1-9][0-9][0-9]\.%" | cut -d: -f1)
    
    if [ ! -z "$high_memory_containers" ]; then
        log "⚠️  High memory containers detected: $high_memory_containers"
        
        for container in $high_memory_containers; do
            log "🔄 Restarting container: $container"
            docker restart "$container" 2>/dev/null || true
        done
    fi
}

# Main monitoring loop
main() {
    log "🚀 Starting Stackfolio memory monitor..."
    
    while true; do
        memory_usage=$(get_memory_usage)
        
        log "📊 System memory usage: ${memory_usage}%"
        
        if [ "$memory_usage" -gt "$CLEANUP_THRESHOLD" ]; then
            log "🚨 Memory usage critical (${memory_usage}% > ${CLEANUP_THRESHOLD}%) - Starting emergency cleanup"
            
            # Emergency cleanup
            cleanup_docker
            optimize_containers
            
            # Wait a bit for cleanup to take effect
            sleep 10
            
            # Check again
            new_memory_usage=$(get_memory_usage)
            if [ "$new_memory_usage" -gt "$CLEANUP_THRESHOLD" ]; then
                log "🚨 Still high memory usage (${new_memory_usage}%) - Switching to ultra-lightweight mode"
                restart_lightweight
            fi
            
        elif [ "$memory_usage" -gt "$MEMORY_THRESHOLD" ]; then
            log "⚠️  Memory usage high (${memory_usage}% > ${MEMORY_THRESHOLD}%) - Running optimization"
            optimize_containers
        fi
        
        # Show Docker memory usage every 5 minutes
        if [ $(($(date +%s) % 300)) -lt 30 ]; then
            log "📋 Docker memory usage:"
            get_docker_memory | while read line; do
                log "   $line"
            done
        fi
        
        sleep 30
    done
}

# Handle script termination
trap 'log "🛑 Memory monitor stopped"; exit 0' INT TERM

# Start monitoring
main
