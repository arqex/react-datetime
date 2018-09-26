const toUtc = (time: Date) =>
  new Date(time.getTime() + time.getTimezoneOffset() * 60000);

export default toUtc;
