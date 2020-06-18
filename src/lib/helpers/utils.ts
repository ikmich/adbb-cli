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