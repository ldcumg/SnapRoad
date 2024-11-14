import { IconCalendarNr } from '@/lib/icon/Icon_Calendar_Nr';
import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputWithIconProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const DateInputWithIcon = forwardRef<HTMLInputElement, DateInputWithIconProps>(
  ({ value, onChange, onBlur, name }, ref) => {
    const [startDate, setStartDate] = useState<Date | null>(value ? new Date(value) : null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    const handleInputClick = () => {
      setDatePickerOpen(!isDatePickerOpen);
    };

    const handleDateChange = (date: Date | null) => {
      setStartDate(date);
      setDatePickerOpen(false);

      if (onChange && date) {
        // Date 객체를 문자열로 변환하고 ChangeEvent 형식으로 래핑
        const fakeEvent = {
          target: { value: date.toLocaleDateString('ko-KR') },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }
    };

    return (
      <label className='input-no-calendar relative flex w-full items-center'>
        <div className='relative w-full'>
          <input
            type='text'
            name={name}
            value={startDate ? startDate.toLocaleDateString('ko-KR') : '날짜 입력'}
            readOnly
            onClick={handleInputClick}
            onBlur={onBlur}
            className='w-full border-none p-2 pr-10'
            ref={ref}
          />
          <span
            className='absolute right-3 top-2 cursor-pointer'
            onClick={handleInputClick}
          >
            <IconCalendarNr />
          </span>
          {isDatePickerOpen && (
            <div className='absolute left-0 top-full z-10 mt-2'>
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date as Date)}
                inline
              />
            </div>
          )}
        </div>
      </label>
    );
  },
);

DateInputWithIcon.displayName = 'DateInputWithIcon';

export default DateInputWithIcon;
