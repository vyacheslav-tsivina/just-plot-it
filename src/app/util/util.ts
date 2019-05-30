
export class Util {
    static removeIf = function (arr, callback) {
        var i = 0;
        while (i < arr.length) {
            if (callback(arr[i], i)) {
                arr.splice(i, 1);
            }
            else {
                ++i;
            }
        }
    };

    /**
     * Converts a string in RGB format(i.e. '#FFFFFF') into RGBA format with given alpha value
     */
    static hexToRgbA = function(hex, alpha){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        throw new Error('Bad Hex');
    }
}