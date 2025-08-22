# Use a base image with a compatible JDK. OpenJDK 17 is a common choice for modern Android builds.
FROM openjdk:17-jdk-slim

# Set environment variables for the Android SDK
ENV ANDROID_SDK_ROOT="/sdk"
ENV PATH="$PATH:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools"

# Set a consistent working directory
WORKDIR /app

# Install essential packages and Android command-line tools
# Using ARG to make versions easily updatable
ARG CMDLINE_TOOLS_VERSION="11076708"
ARG BUILD_TOOLS_VERSION="34.0.0"
ARG PLATFORM_VERSION="34"

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && wget -q "https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip" -O /tmp/cmdline-tools.zip \
    && mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
    && unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
    && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm /tmp/cmdline-tools.zip \
    # Accept licenses automatically
    && yes | sdkmanager --licenses > /dev/null \
    # Install the required SDK packages
    && sdkmanager "platform-tools" "platforms;android-${PLATFORM_VERSION}" "build-tools;${BUILD_TOOLS_VERSION}"

# --- Optimization: Leverage Docker Layer Caching ---
# First, copy only the files needed to download dependencies.
# This layer will only be rebuilt if these specific files change.

# WRONG PATHS (Before)
# COPY build.gradle gradlew settings.gradle ./
# COPY gradle/ gradle/
# COPY app/build.gradle app/

# CORRECT PATHS (After - assuming the folder is named 'touchblack')
COPY touchblack/build.gradle touchblack/gradlew touchblack/settings.gradle ./
COPY touchblack/gradle/ gradle/
COPY touchblack/app/build.gradle app/

# Download dependencies. This step is cached as long as the build files don't change.
# The --no-daemon flag is recommended for CI environments.
RUN ./gradlew dependencies --no-daemon

# Now, copy the rest of the application source code
# WRONG PATH (Before)
# COPY . .
# CORRECT PATH (After)
COPY touchblack/. .

# Grant execution permissions to the Gradle wrapper script
RUN chmod +x ./gradlew