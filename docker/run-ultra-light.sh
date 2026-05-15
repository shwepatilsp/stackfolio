#!/bin/bash

# Stackfolio Ultra-Lightweight Runner
# Optimized for low-memory systems

set -e

echo "🚀 Starting Stackfolio in ULTRA-LIGHTWEIGHT mode"
echo "⚡ Optimized for systems with limited memory"
echo ""

# Function to cleanup before starting
cleanup() {
    echo "🧹 Cleaning up existing containers and images..."
    
    # Stop all stackfolio containers
    docker ps --filter "name=stackfolio" -q | xargs -r docker stop
    
    # Remove all stackfolio containers
    docker ps --filter "name=stackfolio" -a -q | xargs -r docker rm
    
    # Clean up dangling images
    docker image prune -f
    
    # Clean up unused networks
    docker network prune -f
    
    echo "✅ Cleanup completed"
}

# Function to check system memory
check_memory() {
    if command -v free >/dev/null 2>&1; then
        # Linux
        total_memory=$(free -m | awk 'NR==2{print $2}')
        available_memory=$(free -m | awk 'NR==2{print $7}')
    else
        # macOS
        total_memory=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024)}')
        available_memory=$(vm_stat | perl -ne '/page size of (\d+)/ and $ps=$1; /Pages free:\s+(\d+)/ and $free=$1; /Pages inactive:\s+(\d+)/ and $inactive=$1; /Pages active:\s+(\d+)/ and $active=$1; /Pages wired down:\s+(\d+)/ and $wired=$1; END{printf int(($free+$inactive)*$ps/1024/1024)}')
    fi
    
    echo "💾 System Memory Status:"
    echo "   Total: ${total_memory}MB"
    echo "   Available: ${available_memory}MB"
    
    if [ "$available_memory" -lt 1024 ]; then
        echo "⚠️  Low memory detected (${available_memory}MB available)"
        echo "   Ultra-lightweight mode recommended"
    elif [ "$available_memory" -lt 2048 ]; then
        echo "⚠️  Moderate memory (${available_memory}MB available)"
        echo "   Lightweight mode recommended"
    else
        echo "✅ Sufficient memory (${available_memory}MB available)"
    fi
}

# Function to start ultra-lightweight services
start_ultra_light() {
    echo "🔧 Starting ultra-lightweight Stackfolio..."
    
    cd "$(dirname "$0")"
    
    # Start ultra-lightweight configuration
    docker-compose -f docker-compose-ultra-light.yml up -d --build
    
    echo "⏳ Waiting for services to initialize..."
    sleep 20
}

# Function to verify services
verify_services() {
    echo "🔍 Verifying service health..."
    
    services=("stackfolio-postgres:5432" "stackfolio-profile-service:8081" "stackfolio-frontend:3000")
    
    for service in "${services[@]}"; do
        name=$(echo "$service" | cut -d: -f1)
        port=$(echo "$service" | cut -d: -f2)
        
        if nc -z localhost "$port" 2>/dev/null; then
            echo "✅ $name is running on port $port"
        else
            echo "❌ $name is not responding on port $port"
        fi
    done
}

# Function to show memory usage
show_memory_usage() {
    echo ""
    echo "📊 Current Memory Usage:"
    
    # System memory
    if command -v free >/dev/null 2>&1; then
        # Linux
        memory_info=$(free -h | awk 'NR==2{printf "System: %s/%s (%.0f%%)", $3,$2,$3*100/$2}')
        echo "   $memory_info"
    else
        # macOS
        total_memory=$(sysctl -n hw.memsize | awk '{printf "%.1fGB", $1/1024/1024/1024}')
        used_memory=$(vm_stat | perl -ne '/page size of (\d+)/ and $ps=$1; /Pages active:\s+(\d+)/ and $active=$1; /Pages wired down:\s+(\d+)/ and $wired=$1; END{printf "%.1fGB", ($active+$wired)*$ps/1024/1024/1024}')
        echo "   System: ${used_memory}/${total_memory}"
    fi
    
    # Docker containers
    echo "   Docker Containers:"
    docker stats --no-stream --format "   {{.Container}}: {{.MemUsage}} ({{.MemPerc}})" | grep stackfolio || echo "   No containers running"
}

# Function to show access URLs
show_urls() {
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Profile API: http://localhost:8081"
    echo "   API Health: http://localhost:8081/actuator/health"
    echo ""
    echo "📝 Useful Commands:"
    echo "   View logs: docker-compose -f docker-compose-ultra-light.yml logs -f"
    echo "   Stop services: docker-compose -f docker-compose-ultra-light.yml down"
    echo "   Monitor memory: ./memory-monitor.sh"
}

# Main execution
main() {
    echo "🎯 Stackfolio Ultra-Lightweight Launcher"
    echo "======================================="
    
    # Check memory before starting
    check_memory
    echo ""
    
    # Cleanup existing resources
    cleanup
    echo ""
    
    # Start ultra-lightweight services
    start_ultra_light
    
    # Verify services
    verify_services
    echo ""
    
    # Show memory usage
    show_memory_usage
    echo ""
    
    # Show access information
    show_urls
    
    echo "✅ Stackfolio ultra-lightweight setup complete!"
    echo ""
    echo "💡 Tips:"
    echo "   - Use memory-monitor.sh to track memory usage"
    echo "   - Frontend connects directly to profile-service (no gateway)"
    echo "   - Only essential services are running"
    echo "   - All containers have strict memory limits"
}

# Run main function
main
