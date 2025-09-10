# Use a base image with a compatible JDK for Android
FROM openjdk:17-jdk-slim

# --- Environment Setup ---
# 1. Install Node.js v24, Yarn, and essential build tools
ENV NODE_VERSION=24.1.0
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    wget \
    xz-utils \
    && curl -sL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" | tar -xJ -C /usr/local --strip-components=1 \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# 2. Install the Android SDK Command-Line Tools
ENV ANDROID_SDK_ROOT="/sdk"
ENV PATH="$PATH:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools"
ARG CMDLINE_TOOLS_VERSION="11076708"
ARG BUILD_TOOLS_VERSION="34.0.0"
ARG PLATFORM_VERSION="34"
ARG CMAKE_VERSION="3.22.1"
RUN wget -q "https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip" -O /tmp/cmdline-tools.zip \
    && mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
    && unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
    && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm /tmp/cmdline-tools.zip \
    && yes | sdkmanager --licenses > /dev/null \
    && sdkmanager "platform-tools" "platforms;android-${PLATFORM_VERSION}" "build-tools;${BUILD_TOOLS_VERSION}" "cmake;${CMAKE_VERSION}" \
    && chmod +x /sdk/cmake/${CMAKE_VERSION}/bin/ninja

# --- Application Build ---
# Set the main working directory for the app
WORKDIR /app

# Copy all the project files into the container
COPY . .

# Install JavaScript dependencies using Yarn
RUN yarn install

# Move into the android directory to run the native build
WORKDIR /app/android

# Point to the gradlew script inside the android folder and specify the project with "-p android".
# This resolves the code generation and CMake errors.
CMD ["./gradlew", "assembleRelease", "bundleRelease", "--no-daemon"]