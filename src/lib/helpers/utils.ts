export function yes(o: any) {
  let b = typeof o !== 'undefined' && o !== null;
  if (o && typeof o === 'string') {
    b = b && o !== '';
  }

  return b;
}

export function no(o: any) {
  return !yes(o);
}

export function removeEndLines(s: string, numLines = 0) {
  if (no(s)) {
    return s;
  }

  function getQualifier() {
    if (numLines > 0) {
      return `{${numLines}}`;
    }
    return '+';
  }

  let regexp = new RegExp(`(\\n|\\r\\n)${getQualifier()}$`);
  // let rex = /(\n|\r\n)+$/;
  return s.replace(regexp, '');
}

export function arrayContains(haystack: any[], needle: any): boolean {
  return haystack.indexOf(needle) > -1;
}

export function arrayContainsAnyOf(haystack: any[], needles: any[]): boolean {
  for (let item of haystack) {
    if (haystack.indexOf(item) > -1) {
      return true;
    }
  }
  return false;
}

export function isEmpty(subject: any): boolean {
  if (no(subject)) {
    return true;
  }

  switch (true) {
    case typeof subject === 'string':
      return no(subject);
    case Array.isArray(subject):
      return subject.length === 0;
    case typeof subject === 'object':
      return Object.keys(subject).length === 0;
    case typeof subject === 'number':
      return subject === 0;
    default:
      return no(subject);
  }
}

export function _fn<T>(f:() => T) {
  return f();
}