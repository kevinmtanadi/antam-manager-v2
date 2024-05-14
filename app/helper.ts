export const formatRupiah = (amount?: number, currency = 'IDR'): string => {
    if (!amount) {
      return "-";
    }
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    });
}

export const formatDate = (time: string, format?: string): string => {
    const date = new Date(time);
    
    const options: Intl.DateTimeFormatOptions = {};
    let formattedDate = "";
    
    const dd = date.getDate().toString().padStart(2, '0');
    
    const mm = date.getMonth().toString().padStart(2, '0');
    const year = date.getFullYear();
    const yy = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    if (!format) {
        return `${dd}/${mm}/${year} ${hours}:${minutes}:${seconds}`
    }

    // SHORT FORM
   if (format.includes('dd')) {
    format = format.replace('dd', dd);
   }
   if (format.includes('mm') && !format.includes('mmm')) {
    format = format.replace('mm', mm);
   }
   if (format.includes('yy') && !format.includes('yyyy')) {
    format = format.replace('yy', yy);
   }
   
   // LONG FORM
   if (format.includes('month')) {
    const month = new Intl.DateTimeFormat('id', { month: 'long' }).format(date);
    format = format.replace('month', month);
   }
   if (format.includes('yyyy')) {
    format = format.replace('yyyy', year.toString());
   }
   if (format.includes('mmm')) {
    const mmm = new Intl.DateTimeFormat('id', { month: 'short' }).format(date);
    format = format.replace('mmm', mmm);
   }
   
   // TIME
   if (format.includes('HH')) {
    format = format.replace('HH', hours);
   }
   if (format.includes('MM')) {
    format = format.replace('MM', minutes);
   }
   if (format.includes('SS')) {
    format = format.replace('SS', seconds);
   }

    return format;
}