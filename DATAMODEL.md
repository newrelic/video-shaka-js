# Introduction

This document provides an overview of the Events and Attributes used for media monitoring in New Relic.

# Glossary

This section defines the key terms used in the context of New Relic Media monitoring:

## Event Types

- **videoAction**: Events triggered by general video interactions, such as starting, pausing, or seeking.
- **videoAdAction**: Events related to ad playback, such as starting, completing, or skipping an ad.
- **videoErrorAction**: Events triggered by errors encountered during video or ad playback.
- **videoCustomAction**: Custom events defined to capture specific actions or interactions beyond default event types.

## Attribute

An Attribute is a piece of data associated with an event. Attributes provide additional context or details about the event, such as the video’s title, duration, or playback position.

- Most attributes are included with every event.
- Some attributes are specific to certain event types, such as ad-related data sent with ad events.

## Event Type Reference

### VideoAction

| Attribute Name           | Definition                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionName               | The specific action being performed in the video player, such as play, pause, resume, content buffering, etc.                                      |
| appId                    | The ID of your application, as recorded by New Relic.                                                                                              |
| appName                  | The name of the application.                                                                                                                       |
| playerName               | The name of the video player.                                                                                                                      |
| playerVersion            | The version of the video player.                                                                                                                   |
| deviceType               | The specific type of the device: iPhone 8, iPad Pro, etc.                                                                                          |
| deviceGroup              | The category of the device, such as iPhone or Tablet.                                                                                              |
| deviceManufacturer       | The manufacturer of the device, such as Motorola or HTC.                                                                                           |
| deviceModel              | The model number of the device.                                                                                                                    |
| deviceName               | The device's name.                                                                                                                                 |
| deviceSize               | The display size of the device: Small, normal, large, xlarge.                                                                                      |
| deviceUuid               | A unique identifier assigned at the time of app installation by New Relic.                                                                         |
| viewSession              | Trackers will generate unique IDs for every new video session. This could be the session ID from the client.                                       |
| viewId                   | Trackers will generate unique IDs for every new video iteration.                                                                                   |
| contentId                | The ID of the video.                                                                                                                               |
| contentTitle             | The title of the video.                                                                                                                            |
| contentIsLive            | True if the video is live.                                                                                                                         |
| contentBitrate           | Bitrate (in bits) of the video.                                                                                                                    |
| contentRenditionName     | Name of the rendition (e.g., 1080p).                                                                                                               |
| contentRenditionBitrate  | Target Bitrate of the rendition.                                                                                                                   |
| contentRenditionHeight   | Rendition actual Height (before re-scaling).                                                                                                       |
| contentRenditionWidth    | Rendition actual Width (before re-scaling).                                                                                                        |
| contentDuration          | Duration of the video, in ms.                                                                                                                      |
| contentPlayhead          | Playhead (currentTime) of the video, in ms.                                                                                                        |
| contentLanguage          | Language of the video. We recommend using locale notation, e.g., en_US.                                                                            |
| contentSrc               | URL of the resource being played.                                                                                                                  |
| contentPlayrate          | Playrate (speed) of the video, e.g., 1.0, 0.5, 1.25.                                                                                               |
| contentIsFullscreen      | True if the video is currently fullscreen.                                                                                                         |
| contentIsMuted           | True if the video is currently muted.                                                                                                              |
| contentCdn               | The CDN serving the content.                                                                                                                       |
| contentIsAutoplayed      | If the player was auto-played.                                                                                                                     |
| contentPreload           | The player preload attribute.                                                                                                                      |
| contentFps               | Current FPS (Frames per second).                                                                                                                   |
| isBackgroundEvent        | If the player is hidden by another window.                                                                                                         |
| totalAdPlaytime          | Total time ad is played for this video session.                                                                                                    |
| elapsedTime              | Active Time between two consecutive heartbeats                                                                                                     |
| bufferType               | When buffer starts, i.e., initial, seek, pause & connection.                                                                                       |
| asn                      | Autonomous System Number: a unique number identifying a group of IP networks that serves the content to the end user.                              |
| asnLatitude              | The latitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's latitude.   |
| asnLongitude             | The longitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's longitude. |
| asnOrganization          | The organization that owns the Autonomous System Number. Often an ISP, sometimes a private company or institution.                                 |
| timestamp                | The time (date, hour, minute, second) at which the interaction occurred.                                                                           |
| instrumentation.provider | Player/agent name.                                                                                                                                 |
| instrumentation.name     | Name of the instrumentation collecting the data.                                                                                                   |
| instrumentation.version  | Agent’s version.                                                                                                                                   |

#### List of possible Video Actions

| Action Name              | Definition                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| PLAYER_READY             | The player is ready to start sending events.                                                     |
| DOWNLOAD                 | Downloading data.                                                                                |
| CONTENT_REQUEST          | Content video has been requested.                                                                |
| CONTENT_START            | Content video started (first frame shown).                                                       |
| CONTENT_END              | Content video ended.                                                                             |
| CONTENT_PAUSE            | Content video paused.                                                                            |
| CONTENT_RESUME           | Content video resumed.                                                                           |
| CONTENT_SEEK_START       | Content video seek started.                                                                      |
| CONTENT_SEEK_END         | Content video seek ended.                                                                        |
| CONTENT_BUFFER_START     | Content video buffering started.                                                                 |
| CONTENT_BUFFER_END       | Content video buffering ended.                                                                   |
| CONTENT_HEARTBEAT        | Content video heartbeat, an event that happens once every 30 seconds while the video is playing. |
| CONTENT_RENDITION_CHANGE | Content video stream quality changed.                                                            |

### VideoAdAction

| Attribute Name           | Definition                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionName               | The specific action being performed in the video player, such as play, pause, resume, content buffering, etc.                                      |
| appId                    | The ID of your application, as recorded by New Relic.                                                                                              |
| appName                  | The name of the application.                                                                                                                       |
| playerName               | The name of the video player.                                                                                                                      |
| playerVersion            | The version of the video player.                                                                                                                   |
| deviceType               | The specific type of the device: iPhone 8, iPad Pro, etc.                                                                                          |
| deviceGroup              | The category of the device, such as iPhone or Tablet.                                                                                              |
| deviceManufacturer       | The manufacturer of the device, such as Motorola or HTC.                                                                                           |
| deviceModel              | The model number of the device.                                                                                                                    |
| viewSession              | Trackers will generate unique IDs for every new video session. This could be the session ID from the client.                                       |
| viewId                   | Trackers will generate unique IDs for every new video iteration.                                                                                   |
| adId                     | The ID of the video.                                                                                                                               |
| adTitle                  | The title of the video.                                                                                                                            |
| adBitrate                | Bitrate (in bits) of the video.                                                                                                                    |
| adRenditionName          | Name of the rendition (e.g., 1080p).                                                                                                               |
| adRenditionBitrate       | Target Bitrate of the rendition.                                                                                                                   |
| adRenditionHeight        | Rendition actual Height (before re-scaling).                                                                                                       |
| adRenditionWidth         | Rendition actual Width (before re-scaling).                                                                                                        |
| adDuration               | Duration of the video, in ms.                                                                                                                      |
| adPlayhead               | Playhead (currentTime) of the video, in ms.                                                                                                        |
| adLanguage               | Language of the ad video. We recommend using locale notation, e.g., en_US.                                                                         |
| adSrc                    | URL of the resource being played.                                                                                                                  |
| adCdn                    | The CDN serving the content.                                                                                                                       |
| adIsMuted                | True if the video is currently muted.                                                                                                              |
| adFps                    | Current FPS (Frames per second).                                                                                                                   |
| adQuartile               | Quartile of the ad. 0 before first, 1 after first quartile, 2 after midpoint, 3 after third quartile, 4 when completed.                            |
| adPosition               | The position of the ad.                                                                                                                            |
| adCreativeId             | The creative ID of the ad.                                                                                                                         |
| adPartner                | The ad partner, e.g., ima, freewheel.                                                                                                              |
| isBackgroundEvent        | If the player is hidden by another window.                                                                                                         |
| bufferType               | When buffer starts, i.e., initial, seek, pause & connection.                                                                                       |
| asn                      | Autonomous System Number: a unique number identifying a group of IP networks that serves the content to the end user.                              |
| asnLatitude              | The latitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's latitude.   |
| asnLongitude             | The longitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's longitude. |
| asnOrganization          | The organization that owns the Autonomous System Number. Often an ISP, sometimes a private company or institution.                                 |
| timestamp                | The time (date, hour, minute, second) at which the interaction occurred.                                                                           |
| elapsedTime              | Active Time between two consecutive heartbeats                                                                                                     |
| instrumentation.provider | Player/agent name.                                                                                                                                 |
| instrumentation.name     | Name of the instrumentation collecting the data.                                                                                                   |
| instrumentation.version  | Agent’s version.                                                                                                                                   |

#### List of possible Video Ad Actions

| Action Name         | Definition                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------- |
| AD_REQUEST          | Ad video has been requested.                                                                |
| AD_START            | Ad video started (first frame shown).                                                       |
| AD_END              | Ad video ended.                                                                             |
| AD_PAUSE            | Ad video paused.                                                                            |
| AD_RESUME           | Ad video resumed.                                                                           |
| AD_SEEK_START       | Ad video seek started.                                                                      |
| AD_SEEK_END         | Ad video seek ended.                                                                        |
| AD_BUFFER_START     | Ad video buffering started.                                                                 |
| AD_BUFFER_END       | Ad video buffering ended.                                                                   |
| AD_HEARTBEAT        | Ad video heartbeat, an event that happens once every 30 seconds while the video is playing. |
| AD_RENDITION_CHANGE | Ad video stream quality changed.                                                            |
| AD_BREAK_START      | Ad break (a block of ads) started.                                                          |
| AD_BREAK_END        | Ad break ended.                                                                             |
| AD_QUARTILE         | Ad quartile happened.                                                                       |
| AD_CLICK            | Ad has been clicked.                                                                        |

### VideoErrorAction

| Attribute Name           | Definition                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionName               | The specific action being performed in the video player, such as play, pause, resume, content buffering, etc.                                      |
| appId                    | The ID of your application, as recorded by New Relic.                                                                                              |
| appName                  | The name of the application.                                                                                                                       |
| playerName               | The name of the video player.                                                                                                                      |
| playerVersion            | The version of the video player.                                                                                                                   |
| deviceType               | The specific type of the device: iPhone 8, iPad Pro, etc.                                                                                          |
| deviceGroup              | The category of the device, such as iPhone or Tablet.                                                                                              |
| deviceManufacturer       | The manufacturer of the device, such as Motorola or HTC.                                                                                           |
| deviceModel              | The model number of the device.                                                                                                                    |
| viewSession              | Trackers will generate unique IDs for every new video session. This could be the session ID from the client.                                       |
| viewId                   | Trackers will generate unique IDs for every new video iteration.                                                                                   |
| contentId                | The ID of the video.                                                                                                                               |
| contentTitle             | The title of the video.                                                                                                                            |
| errorMessage             | Message of the error.                                                                                                                              |
| errorCode                | Error code if it's known.                                                                                                                          |
| backTrace                | Stack trace of the error.                                                                                                                          |
| isBackgroundEvent        | If the player is hidden by another window.                                                                                                         |
| contentSrc               | Content source URL.                                                                                                                                |
| contentCdn               | Content CDN URL.                                                                                                                                   |
| asn                      | Autonomous System Number: a unique number identifying a group of IP networks that serves the content to the end user.                              |
| asnLatitude              | The latitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's latitude.   |
| asnLongitude             | The longitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's longitude. |
| asnOrganization          | The organization that owns the Autonomous System Number. Often an ISP, sometimes a private company or institution.                                 |
| elapsedTime              | Active Time between two consecutive heartbeats.                                                                                                    |
| timestamp                | The time (date, hour, minute, second) at which the interaction occurred.                                                                           |
| instrumentation.provider | Player/agent name.                                                                                                                                 |
| instrumentation.name     | Name of the instrumentation collecting the data.                                                                                                   |
| instrumentation.version  | Agent’s version.                                                                                                                                   |

#### List of possible Video Error Actions

| Action Name   | Definition           |
| ------------- | -------------------- |
| AD_ERROR      | Ad video error.      |
| ERROR         | An error happened.   |
| CRASH         | App crash happened.  |
| CONTENT_ERROR | Content video error. |

### VideoCustomAction

| Attribute Name           | Definition                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionName               | The name of the PageAction, as defined by client in their code.                                                                                    |
| appId                    | The ID of your application, as recorded by New Relic.                                                                                              |
| appName                  | The name of the application.                                                                                                                       |
| playerName               | The name of the video player.                                                                                                                      |
| playerVersion            | The version of the video player.                                                                                                                   |
| deviceType               | The specific type of the device: iPhone 8, iPad Pro, etc.                                                                                          |
| deviceGroup              | The category of the device, such as iPhone or Tablet.                                                                                              |
| deviceManufacturer       | The manufacturer of the device, such as Motorola or HTC.                                                                                           |
| deviceModel              | The model number of the device.                                                                                                                    |
| viewSession              | Trackers will generate unique IDs for every new video session. This could be the session ID from the client.                                       |
| viewId                   | Trackers will generate unique IDs for every new video iteration.                                                                                   |
| contentId                | The ID of the video.                                                                                                                               |
| contentTitle             | The title of the video.                                                                                                                            |
| isBackgroundEvent        | If the player is hidden by another window.                                                                                                         |
| asn                      | Autonomous System Number: a unique number identifying a group of IP networks that serves the content to the end user.                              |
| asnLatitude              | The latitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's latitude.   |
| asnLongitude             | The longitude of the geographic center of the postal code where the Autonomous System Network is registered. This is not the end user's longitude. |
| asnOrganization          | The organization that owns the Autonomous System Number. Often an ISP, sometimes a private company or institution.                                 |
| timestamp                | The time (date, hour, minute, second) at which the interaction occurred.                                                                           |
| instrumentation.provider | Player/agent name.                                                                                                                                 |
| instrumentation.name     | Name of the instrumentation collecting the data.                                                                                                   |
| instrumentation.version  | Agent’s version.                                                                                                                                   |
