import React, { useEffect, useState } from 'react';

const SaveDate = ({ date }) => {
	const [formDate, setFormDate] = useState("");

	useEffect(() => {
		const isValidDate = (d) => {
      return d instanceof Date && !isNaN(d);
    };

    const now = new Date(date);

    if (!isValidDate(now)) {
      setFormDate("unsaved");
      return;
    }
    
    const padZero = num => (num < 10 ? '0' : '') + num;
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const timeString = `${hours}:${minutes}`;

    const dateString = (() => {
      const day = now.getDate();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const month = monthNames[now.getMonth()];
      
      const nth = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (now.toDateString() === today.toDateString()) {
        return 'today';
      } else if (now.toDateString() === yesterday.toDateString()) {
        return 'yesterday';
      } else {
        return `${day}${nth(day)} ${month}`;
      }
    })();

    setFormDate(`${dateString} at ${timeString}`);
	}, [date]);

	return (
    <span className="save-date">{formDate}</span>
  );
}

export default SaveDate