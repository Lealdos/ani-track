# Use the official PostgreSQL base image
FROM postgres:18

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123.Leonardo
ENV POSTGRES_DB=anitrack


# Expose the PostgreSQL port
EXPOSE 5432
