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
  // Validate date first, before any JSX construction
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return <span className={className}>Invalid date</span>;
  }

  // Format the date - catch any potential errors from date-fns
  let formattedDate: string;
  try {
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
  } catch {
    // If date formatting fails, return invalid date message
    return <span className={className}>Invalid date</span>;
  }

  // Construct JSX outside of try/catch block
  return (
    <time dateTime={dateString} className={className}>
      {formattedDate}
    </time>
  );
}

