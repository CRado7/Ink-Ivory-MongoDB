import app from "./src/app.js";
import { config } from "./src/config/env.js";
import scheduleReminders from './src/services/reminderService.js'

const PORT = config.PORT;

// Schedule reminders
scheduleReminders();

app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});