function padStart2(value) {
  return String(value).padStart(2, "0");
}

function buildDate(day, month, year) {
  return `${padStart2(day)}/${padStart2(month)}/${year}`;
}

function toComponents(raw) {
  if (raw instanceof Date) {
    return {
      day: raw.getDate(),
      month: raw.getMonth() + 1,
      year: raw.getFullYear(),
      hour: raw.getHours(),
      minute: raw.getMinutes(),
      second: raw.getSeconds(),
      valid: !Number.isNaN(raw.getTime()),
      hasTime: true,
    };
  }

  const value = String(raw);

  const dateTimeSeconds = value.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{1,2}):(\d{1,2})/
  );
  if (dateTimeSeconds) {
    return {
      day: Number(dateTimeSeconds[3]),
      month: Number(dateTimeSeconds[2]),
      year: Number(dateTimeSeconds[1]),
      hour: Number(dateTimeSeconds[4]),
      minute: Number(dateTimeSeconds[5]),
      second: Number(dateTimeSeconds[6]),
      valid: true,
      hasTime: true,
    };
  }

  const dateTime = value.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{1,2})/
  );
  if (dateTime) {
    return {
      day: Number(dateTime[3]),
      month: Number(dateTime[2]),
      year: Number(dateTime[1]),
      hour: Number(dateTime[4]),
      minute: Number(dateTime[5]),
      second: 0,
      valid: true,
      hasTime: true,
    };
  }

  const dateOnlyDash = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (dateOnlyDash) {
    return {
      day: Number(dateOnlyDash[3]),
      month: Number(dateOnlyDash[2]),
      year: Number(dateOnlyDash[1]),
      hour: 0,
      minute: 0,
      second: 0,
      valid: true,
      hasTime: false,
    };
  }

  const dateOnlySlash = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (dateOnlySlash) {
    return {
      day: Number(dateOnlySlash[3]),
      month: Number(dateOnlySlash[2]),
      year: Number(dateOnlySlash[1]),
      hour: 0,
      minute: 0,
      second: 0,
      valid: true,
      hasTime: false,
    };
  }

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return { valid: false, hasTime: false, raw: value };
  }

  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    valid: true,
    hasTime: true,
  };
}

export function formatDate(raw) {
  if (!raw) {
    return "";
  }

  const c = toComponents(raw);
  if (!c.valid) {
    return String(raw);
  }

  return buildDate(c.day, c.month, c.year);
}

export function formatDateTime(raw, withSeconds = false) {
  if (!raw) {
    return "";
  }

  const c = toComponents(raw);
  if (!c.valid) {
    return String(raw);
  }

  const date = buildDate(c.day, c.month, c.year);
  if (!c.hasTime) {
    return date;
  }

  const seconds = withSeconds ? `:${padStart2(c.second)}` : "";
  const time = `${padStart2(c.hour)}:${padStart2(c.minute)}${seconds}`;

  return `${date} ${time}`;
}
