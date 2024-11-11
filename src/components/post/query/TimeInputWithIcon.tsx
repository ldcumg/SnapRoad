import { IconClock } from '@/lib/icon/Icon_clock';
import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TimeInputWithIconProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const TimeInputWithIcon = forwardRef<HTMLInputElement, TimeInputWithIconProps>(
  ({ value, onChange, onBlur, name }, ref) => {
    const [selectedTime, setSelectedTime] = useState<Date | null>(value ? new Date(value) : null);
    const [isTimePickerOpen, setTimePickerOpen] = useState(false);

    const handleInputClick = () => {
      setTimePickerOpen(!isTimePickerOpen);
    };

    const handleTimeChange = (date: Date | null) => {
      setSelectedTime(date);
      setTimePickerOpen(false);

      if (onChange && date) {
        const fakeEvent = {
          target: { value: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) },
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
            value={
              selectedTime
                ? selectedTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                : '시간 입력'
            }
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
            <IconClock />
          </span>
          {isTimePickerOpen && (
            <div className='absolute left-0 top-full z-10 mt-2'>
              <DatePicker
                selected={selectedTime}
                onChange={(date) => handleTimeChange(date as Date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30} // 시간 간격 30분
                timeCaption='시간'
                dateFormat='HH:mm'
                inline
              />
            </div>
          )}
        </div>
      </label>
    );
  },
);

TimeInputWithIcon.displayName = 'TimeInputWithIcon';

export default TimeInputWithIcon;
