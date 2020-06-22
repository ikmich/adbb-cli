export function yes(o: any) {
    let b = typeof o !== 'undefined' && o;
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
