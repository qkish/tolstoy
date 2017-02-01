
export function validate_account_name(value) {
    let i, label, len, length, ref, suffix;

    suffix = 'Account name should ';
    if (!value) {
        return suffix + 'not be empty.';
    }
    length = value.length;
    if (length < 1) {
        return suffix + 'be longer.';
    }
    if (length > 190) {
        return suffix + 'be shorter.';
    }
    
    ref = value.split('.');
    
    return null;
}
