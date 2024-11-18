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

// 12시간제 -> 24시간제로 변환
if (modifier === '오후' && hours !== 12) {
    hours += 12;  // 오후일 경우 12시간을 더하기
} else if (modifier === '오전' && hours === 12) {
    hours = 0;  // 오전 12시를 0시로 처리
}

// 24시간제로 변환된 시간으로 Date 객체 생성
const date = new Date(`1970-01-01T${hours}:${minutes}:00Z`);
if (isNaN(date.getTime())) {
    console.error('Invalid date object:', date);
    return new Date(); // 유효하지 않은 날짜일 경우 기본값을 반환
}
return date;
};
