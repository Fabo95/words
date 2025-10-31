# Use the official Kafka Connect Image.
FROM confluentinc/cp-kafka-connect:latest

# Set Kafka Connect plugins path.
ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"

# Install necessary connectors here.
RUN confluent-hub install --no-prompt debezium/debezium-connector-postgresql:2.5.4

# All plug-in directories are on this path: /usr/share/confluent-hub-components
# See: https://repo1.maven.org/maven2/io/debezium/debezium-scripting/3.0.8.Final/debezium-scripting-3.0.8.Final.tar.gz
# Download the Debezium Scripting SMT and extract the contents to the Debezium plug-in directories.
RUN curl -L https://repo1.maven.org/maven2/io/debezium/debezium-scripting/3.0.8.Final/debezium-scripting-3.0.8.Final.tar.gz \
    -o /tmp/debezium-scripting.tar.gz && \
    tar -xzf /tmp/debezium-scripting.tar.gz -C /usr/share/confluent-hub-components/debezium-debezium-connector-postgresql/ && \
    rm /tmp/debezium-scripting.tar.gz

# Download a JSR-223 script engine implementation and add the contents to the Debezium plug-in directories
RUN curl -L https://repo1.maven.org/maven2/org/codehaus/groovy/groovy-jsr223/3.0.9/groovy-jsr223-3.0.9.jar \
    -o /usr/share/confluent-hub-components/debezium-debezium-connector-postgresql/groovy-jsr223-3.0.9.jar

RUN curl -L https://repo1.maven.org/maven2/org/codehaus/groovy/groovy/3.0.9/groovy-3.0.9.jar \
    -o /usr/share/confluent-hub-components/debezium-debezium-connector-postgresql/groovy-3.0.9.jar


# Configure the default converter for Kafka Connect.
ENV CONNECT_KEY_CONVERTER="io.confluent.connect.avro.AvroConverter"
ENV CONNECT_VALUE_CONVERTER="io.confluent.connect.avro.AvroConverter"