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

// 12시간제 시간을 24시간제로 변환하는 함수
const convertTo24HourFormat = (time12hr: string): Date => {
  if (!time12hr || typeof time12hr !== 'string') {
    console.error('Invalid time format:', time12hr);
    return new Date(); // 기본값을 반환하거나 오류 처리
  }

  const [time, modifier] = time12hr.split(' ');  // 예: ['10:30', '오후']
  if (!time || !modifier) {
    console.error('Invalid time string:', time12hr);
    return new Date(); // 기본값을 반환하거나 오류 처리
  }

  let [hours, minutes] = time.split(':').map(Number);  // 시간을 나누고 숫자 형식으로 변환

  if (modifier === '오후' && hours !== 12) {
    hours += 12;  // 오후일 경우 12시간을 더하기
  } else if (modifier === '오전' && hours === 12) {
    hours = 0;  // 오전 12시를 0시로 처리
  }

  // 24시간제로 변환된 시간으로 Date 객체 생성
  return new Date(`1970-01-01T${hours}:${minutes}:00Z`); // 유효한 날짜 형식으로 생성
};

const TimeInputWithIcon = forwardRef<HTMLInputElement, TimeInputWithIconProps>(
  ({ value, onChange, onBlur, name }, ref) => {
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [isTimePickerOpen, setTimePickerOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // 12시간제 시간 값이 있을 경우 24시간제로 변환
    useEffect(() => {
      if (value) {
        setSelectedTime(convertTo24HourFormat(value));
      }
    }, [value]);

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

    // 외부 클릭 감지
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
      <label className="input-no-calendar relative flex w-full items-center">
        <div ref={wrapperRef} className="relative w-full">
          <input
            type="text"
            name={name}
            value={
              selectedTime
                ? selectedTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                : '시간 입력'
            }
            readOnly
            onClick={handleInputClick}
            onBlur={onBlur}
            className="w-full border-none p-2 pr-10"
            ref={ref}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={handleInputClick}
          >
            <IconClock />
          </span>
          {isTimePickerOpen && (
            <div className="absolute bottom-full left-0 z-10 mb-2">
              <DatePicker
                selected={selectedTime}
                onChange={(date) => handleTimeChange(date as Date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={10}
                timeCaption="시간"
                dateFormat="HH:mm"
                inline
              />
            </div>
          )}
        </div>
      </label>
    );
  }
);

TimeInputWithIcon.displayName = 'TimeInputWithIcon';

export default TimeInputWithIcon;
