'use client';

import { stringTo24HourDate } from '@/hooks/queries/post/ConvertTo24HourFormat';
import { IconClock } from '@/lib/icon/Icon_Clock';
import { useState, useRef, useEffect, forwardRef } from 'react';
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
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [isTimePickerOpen, setTimePickerOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (value) {
        const convertedDate = stringTo24HourDate(value);
        if (convertedDate) {
          setSelectedTime(convertedDate);
        } else {
          console.warn('Invalid time value provided to TimeInputWithIcon:', value);
          setSelectedTime(null);
        }
      } else {
        setSelectedTime(null);
      }
    }, [value]);

    const handleInputClick = () => {
      setTimePickerOpen((prev) => !prev);
    };

    const handleTimeChange = (date: Date | null) => {
      setSelectedTime(date);
      setTimePickerOpen(false);

      if (onChange && date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const koreanTime = `${hours >= 12 ? '오후' : '오전'} ${
          hours % 12 === 0 ? 12 : hours % 12
        }:${String(minutes).padStart(2, '0')}`;

        const fakeEvent = {
          target: { value: koreanTime },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setTimePickerOpen(false);
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
            value={
              selectedTime
                ? `${selectedTime.getHours() >= 12 ? '오후' : '오전'} ${
                    selectedTime.getHours() % 12 === 0 ? 12 : selectedTime.getHours() % 12
                  }:${String(selectedTime.getMinutes()).padStart(2, '0')}`
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
            <div className='absolute bottom-full left-0 z-10 mb-2'>
              <DatePicker
                selected={selectedTime}
                onChange={(date) => handleTimeChange(date as Date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption='시간'
                dateFormat='hh:mm aa'
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
