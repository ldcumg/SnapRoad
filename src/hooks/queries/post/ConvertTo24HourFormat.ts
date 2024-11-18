export const stringTo24HourDate = (time12hr: string): Date | null => {
  if (!time12hr || typeof time12hr !== 'string') {
    return null;
  }

  const timeRegex = /^(오전|오후) (\d{1,2}):(\d{2})$/;
  const match = timeRegex.exec(time12hr);

  if (!match) {
    return null;
  }

  const [, period, hoursStr, minutesStr] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    return null;
  }

  if (period === '오후' && hours !== 12) {
    hours += 12;
  } else if (period === '오전' && hours === 12) {
    hours = 0;
  }

  return new Date(`1970-01-01T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`);
};

export const convertTo24HourFormatString = (time12hr: string): string | null => {
  try {
    if (!time12hr || typeof time12hr !== 'string') return null;

    const isKorean = time12hr.includes('오전') || time12hr.includes('오후');
    let [time, modifier] = isKorean ? time12hr.split(' ') : time12hr.split(' '); // 영어 포맷 (AM/PM)

    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    let adjustedHours = hours;
    if ((modifier === 'PM' || modifier === '오후') && hours !== 12) {
      adjustedHours += 12;
    } else if ((modifier === 'AM' || modifier === '오전') && hours === 12) {
      adjustedHours = 0;
    }

    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    return null;
  }
};
