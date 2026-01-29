# Awesome Weather Application

(Probably the best, free, and open-source weather app out there)

## A React application built with modern technologies

### Application Features

1. Track the atmospheric conditions of any country or city.
2. Automatically track the weather of any saved location.
3. Customize settings to fit your preferences.
4. Works offline.
5. Predicts the weather for any geographical area up to 5 days ahead with 3-hour intervals.
6. Free and open-source.
7. Built using modern UI technologies.
8. Cross-platform compatibility.
9. Built on PWA technology.

## Technologies Used

- **React JS** [User Interface, Application Logic]
- **Bootstrap** [User Interface]
- **jQuery AJAX** [API Requests]

## Health Check Endpoint

The application includes a health check endpoint for service availability verification and monitoring integration.

### Endpoint Details

| Property | Value |
|----------|-------|
| **Path** | `/health` |
| **Method** | GET |
| **Content-Type** | application/json |
| **Authentication** | None required |

### Usage Example

```bash
curl http://localhost:5000/health
```

### Response Format

The endpoint returns a JSON response with the following structure:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service health status ("ok" when healthy) |
| `uptime` | number | Server uptime in seconds |
| `timestamp` | string | Current timestamp in ISO 8601 format |

### Use Cases

This endpoint can be used for:

- **Service Availability Verification**: Quickly check if the application is running correctly
- **Kubernetes Liveness Probes**: Configure as a liveness probe endpoint for container orchestration
- **Load Balancer Health Checks**: Enable automatic traffic routing based on service health
- **External Monitoring Integration**: Integrate with monitoring tools (e.g., Pingdom, UptimeRobot, Datadog)

### Live Link

[Visit the live application](https://zedd-weather.vercel.app)

### Support

Please support by starring this project. Follow me for more cool open-source projects.

[GitHub - adedoyin-emmanuel](https://github.com/adedoyin-emmanuel/)
