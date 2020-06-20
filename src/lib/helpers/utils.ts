export function yes(o: any) {
    let b = typeof o !== 'undefined' && o;
    if (o && typeof o === 'string') {
        b = b && o !== ''
    }

    return b;
}

export function no(o: any) {
    return !yes(o);
}

export function removeEndLineSpace(s: string) {
    if (no(s)) {
        return s;
    }
    return s.replace(/(\s|\t|\n|\r\n)+$/, '');
}