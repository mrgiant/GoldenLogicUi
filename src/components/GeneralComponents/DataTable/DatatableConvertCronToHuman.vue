<template>
    <div class="flex flex-wrap gap-2" v-if="row[field]">
     
      <span  class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ convertCronToHuman(row[field]) }}</span>
    </div>
</template>

  <script>
  import { markRaw } from 'vue';

  export default {
    props: ['field', 'row','tdProps'],

    methods: {

      convertCronToHuman(cron) {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');

      // Handle the special cases for simplicity
      if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return 'Runs every minute.';
      }

      if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
        return `Runs at 12:00 AM every ${this.convertDayOfWeek(dayOfWeek)}.`;
      }

      const daysOfWeekMap = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
        '*': 'every day'
      };

      const monthsMap = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
        '*': 'every month'
      };

      const readableMinute = this.convertField(minute, 'minute', 59);
      const readableHour = this.convertField(hour, 'hour', 23);
      const readableDayOfMonth = this.convertField(dayOfMonth, 'day of the month', 31);
      const readableMonth = this.convertField(month, 'month', 12, monthsMap);
      const readableDayOfWeek = this.convertField(dayOfWeek, 'day', 6, daysOfWeekMap);

      return `Runs ${readableMinute} ${readableHour} ${readableDayOfMonth} ${readableMonth} on ${readableDayOfWeek}.`;
    },
    convertField(field, fieldType, max, map = {}) {
      if (field === '*') return `every ${fieldType}`;

      if (field.includes('/')) {
        const [start, interval] = field.split('/');
        return `every ${interval} ${fieldType}${interval > 1 ? 's' : ''} starting at ${start}`;
      }

      if (field.includes('-')) {
        const [start, end] = field.split('-');
        return `${fieldType}s from ${start} to ${end}`;
      }

      if (field.includes(',')) {
        const list = field.split(',').map(f => map[f] || f);
        return `${fieldType}s on ${list.join(', ')}`;
      }

      return map[field] || `${fieldType} ${field}`;
    },
    convertDayOfWeek(dayOfWeek) {
      const daysOfWeekMap = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
      };
      return daysOfWeekMap[dayOfWeek] || 'Invalid day';
    },
    formatHour(hour) {
      const parsedHour = parseInt(hour, 10);
      const period = parsedHour >= 12 ? 'PM' : 'AM';
      const formattedHour = parsedHour % 12 || 12; // Convert to 12-hour format
      return `${formattedHour.toString().padStart(2, '0')}:00 ${period}`;
    },
    
    }

    
  }
  </script>

  <style scoped>
  </style>
