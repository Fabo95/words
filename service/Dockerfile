# Use the official Kafka Connect Image.
FROM confluentinc/cp-kafka-connect:latest

# Set Kafka Connect plugins path.
ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"

# Install necessary connectors here.
RUN confluent-hub install --no-prompt debezium/debezium-connector-postgresql:2.5.4

# Configure the default converter for Kafka Connect.
ENV CONNECT_KEY_CONVERTER="io.confluent.connect.avro.AvroConverter"
ENV CONNECT_VALUE_CONVERTER="io.confluent.connect.avro.AvroConverter"