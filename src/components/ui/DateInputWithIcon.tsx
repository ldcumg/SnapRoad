import { IconCalendarNr } from '@/lib/icon/Icon_Calendar_Nr';
import { useState, useEffect, useRef, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputWithIconProps {
  value?: Date;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const DateInputWithIcon = forwardRef<HTMLInputElement, DateInputWithIconProps>(
  ({ value, onChange, onBlur, name }, ref) => {
    const [startDate, setStartDate] = useState<Date | null>(value ? new Date(value) : null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const handleInputClick = () => {
      setDatePickerOpen((prev) => !prev);
    };

    const handleDateChange = (date: Date | null) => {
      setStartDate(date);
      setDatePickerOpen(false); // 날짜 선택 후 바로 닫기

      if (onChange && date) {
        const fakeEvent = {
          target: { value: date.toLocaleDateString('ko-KR') },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }
    };

    // DatePicker 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setDatePickerOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <label className='input-no-calendar relative flex w-full items-center'>
        <div
          ref={wrapperRef}
          className='relative w-full'
        >
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
            <div className='absolute bottom-full left-0 z-10 mb-2'>
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date as Date)}
                inline
                portalId='date-picker-portal'
                popperPlacement='top-end'
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
