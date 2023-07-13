export default function isLocalEnabled(err) {
    try {
        if (!localStorage) throw new Error();
    } catch {
        console.error(err);
        return false;
    }
    return true;
}
