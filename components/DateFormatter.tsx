import { format, formatDistanceToNow } from 'date-fns';

interface DateFormatterProps {
  dateString: string;
  format?: 'full' | 'short' | 'relative';
  className?: string;
}

export default function DateFormatter({
  dateString,
  format: formatType = 'full',
  className = '',
}: DateFormatterProps) {
  let formattedDate: string;

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return <span className={className}>Invalid date</span>;
    }

    switch (formatType) {
      case 'short':
        formattedDate = format(date, 'MMM d, yyyy');
        break;
      case 'relative':
        formattedDate = formatDistanceToNow(date, { addSuffix: true });
        break;
      case 'full':
      default:
        formattedDate = format(date, 'MMMM d, yyyy \'at\' h:mm a');
        break;
    }

    return (
      <time dateTime={dateString} className={className}>
        {formattedDate}
      </time>
    );
  } catch (error) {
    return <span className={className}>Invalid date</span>;
  }
}

