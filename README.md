# Mindful Menu Codebase

This repository holds all the code for the Mindful Menu components, including the mobile app, admin dashboard, and cloud functions.

Each component has it's own sub-directory, and the README in those directories contains information for setup and development.

# Code notes

- For managing the UserDTO fields across 3 components (mobile, admin, functions), you'll need to update both UserDTO and UserFDTO files, for all 3 (6 files).  The difference comes in the converters, for how dates and handled.