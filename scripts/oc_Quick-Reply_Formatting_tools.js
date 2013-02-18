// ==UserScript==
// @name        -    MyOpera: Formatting tools in Quick-Reply
// @author      -    Ayush
// @version     -    1.2.7
// @description -    This userjs adds formatting tools in-
//                     - 'Quick Reply' in forums
//                     - 'Write/Edit comment' area of blog posts
//                     - Private Message Reply page
//                     - Add Comment
// @include			http://bbs.operachina.com/viewtopic.php?*
// @include			http://oc.ls.tl/viewtopic.php?*
// ==/UserScript==

(function (opera) {
    var AutoReSelect = 1,	//-- set to 0 to turn off the 'auto-reselect/auto-reposition' cursor setting.
    PreloadSmilies = 0,		//-- preload the smiles ..
    UseDataURLs = 1,		//-- use data:image urls.
    Open_Smilies = 0;		//-- Set to 1 to auto-open the smilies panel

    opera.AddCodeTools = function (TxtArea, Where, Styles) {
        if (!TxtArea || !Where) return

        var d = document,
            w = window,
            g = 'getElementById',
            c = 'createElement',
            Styles = Styles || {};

        var tDiv = d[c]("DIV"),
            rDiv = d[c]("DIV"),
            smDiv = d[c]('DIV');
        tDiv.className = "OperaEditTools"

        var base = "http://bbs.operachina.com/images/smilies/face/";

        var Smilies = {
            ":1:": "1.gif",
            ":2:": "2.gif",
            ":3:": "3.gif",
            ":4:": "4.gif",
            ":5:": "5.gif",
            ":6:": "6.gif",
            ":7:": "7.gif",
            ":8:": "8.gif",
            ":9:": "9.gif",
            ":10:": "10.gif",
            ":11:": "11.gif",
            ":12:": "12.gif",
            ":13:": "13.gif",
            ":14:": "14.gif",
            ":15:": "15.gif",
            ":16:": "16.gif",
            ":17:": "17.gif",
            ":18:": "18.gif",
            ":19:": "19.gif",
            ":20:": "20.gif",
            ":21:": "21.gif",
            ":23:": "23.gif",
            ":24:": "24.gif",
            ":25:": "25.gif",
            ":26:": "26.gif"
        };

        codes = {
            b: {
                img: 'bold.gif',
                key: 'b',
                dataURI: "R0lGODlhFwAWAJECAAAAANTQyP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAInlI%2Bpy%2B0Po5y0gYsvxSHgyXmaFH5kNp5AZ0ZlCr2Ailb2jef6zicFADs%3D"
            },
            i: {
                img: 'italic.gif',
                key: 'i',
                dataURI: "R0lGODlhFwAWAJECAAAAAICAgP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIjlI%2Bpy%2B0Po5w0gnuruUGLkHmcBwKeMGrlmVIYdsbyTNe2UwAAOw%3D%3D"
            },
            u: {
                img: 'underline.gif',
                key: 'u',
                dataURI: "R0lGODlhFwAWAJECAAAAAICAgP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIrlI%2Bpy%2B0Po5y0gQsEzvIeP4Ea15FiJJ5QSqJmuwKBEKgxVuXIxuv%2BDwxWCgA7"
            },
            del: {
                img: 'strike.gif',
                key: 'd',
                dataURI: "R0lGODlhFwAWAIAAAAAAAP///yH5BAEAAAEALAAAAAAXABYAAAIljI+py+0Po5zUgYvpPXt2A2hZBWIhWZ6PybLQ90UtStf2jedVAQA7"
            },
            sup: {
                img: 'strike.gif',
                dataURI: "R0lGODlhFwAWANUAAAAAAP///z5CUFpdZ0JIWFtfan+DjsTFyBETGCovOyQoMicrNUBGVUdNXEtRYF9kcHN4hHp+iB8jLDlAUDc+TRodJC80P0JJWF5kcZaao5+iqZ6hqBUYHiwyPhYZHxcaIBASFjI2PmlueEFESmpudrG0uhMWGxQXHP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACgALAAAAAAXABYAAAZaQJRwSCwaj8ikcslsOp/IEwcEHY4Kj4TT8/mYhgNCU9EoGUjDzqY5ERUVEKejgxiGJh1J84DpVIQBgQFOARkMC1VEERSJXygWF4kCCgoMGomCg4mbnJ2en0RBADs="
            },
            sub: {
                img: 'strike.gif',
                dataURI: "R0lGODlhFwAWANUAAAAAAP///z5CUFpdZ0JIWFtfan+DjsTFyBETGCovOyQoMicrNUBGVUdNXEtRYF9kcHN4hHp+iB8jLDlAUDc+TRodJC80P0JJWF5kcZaao5+iqZ6hqBUYHiwyPhYZHxcaIBASFjI2PmlueEFESmpudrG0uhMWGxQXHP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACgALAAAAAAXABYAAAZaQJRwSCwaj8ikcslsOp/QpOfzMUVRikbJQLpORNeho4MIow6YTsUcyDAWwhMHBI1QUKPCI9G0oiwXQwMETQIKCgwaQx0bTQGPAUMKEGYhEx0SYZCRZp2en0xBADs="
            },
            left: {
                img: 'alignleft.gif',
                dataURI: "R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIgjI%2Bpy%2B0Po5yg2nunDhjvz3UiGIkWqZkd%2BqgAC8fyPBcAOw%3D%3D"
            },
            center: {
                img: 'aligncenter.gif',
                key: 'a',
                dataURI: "R0lGODlhFwAWAJEAAAAAAP%2F%2F%2F%2F%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIglI%2Bpy%2B0Po5Sg2nunPhjv3YXAp4kVOZkeGqnsC8fyjBQAOw%3D%3D"
            },
            right: {
                img: 'alignright.gif',
                dataURI: "R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIgjI%2Bpy%2B0Po5Sg2nunThjv2YXA94kVGZkeCprsC8fybBQAOw%3D%3D"
            },
            list: {
                img: 'listbullet.gif',
                key: 'l',
                dataURI: "R0lGODlhFwAWAJECAAAAgAAAAP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAImlI%2Bpy%2B0PYwJUKgpM2Jw3bIXiCI5C2aVfZbbuxJJs2q3Zi%2Bf67hQAOw%3D%3D"
            },
            quote: {
                img: 'quote.gif',
                key: 'q',
                dataURI: "R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAImjI%2Bpy%2B0Po5y02osDOBuB%2FimdJoIjh4qpZ6rG%2BbbemtX2jed6VQAAOw%3D%3D"
            },
            code: {
                img: 'code.gif',
                key: 'c',
                dataURI: "R0lGODlhFwAWALMAAAAAALS0tKioqJycnJCQkHh4eGxsbGBgYFRUVDAwMBgYGAwMDAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAXABYAAAQ5EMhJq7046827%2F2AojlIxCcRXKMo0LEmqDaxJBQccZAZgVwEEYKBZKX44mGyzmhBipKh0Sq1ar5QIADs%3D"
            },
            aquote: {
                img: 'quote.gif',
                dataURI: "R0lGODlhFwAWAIAAABp9s////yH5BAEAAAEALAAAAAAXABYAAAImjI+py+0Po5y02osDOBuB/imdJoIjh4qpZ6rG+bbemtX2jed6VQAAOw=="
            },
            acode: {
                img: 'code.gif',
                dataURI: "R0lGODlhFwAWALMAABp9s7Hc9KTW8pjR8IrL7nLA62W66Vm150uv5Sae4B2OyxyFvxp9sxp9sxp9sxp9syH5BAEAAAAALAAAAAAXABYAAAQ5EMhJq7046827/2AojlIxCcRXKMo0LEmqDaxJBQccZAZgVwEEYKBZKX44mGyzmhBipKh0Sq1ar5QIADs="
            },
            opbut: {
                img: 'opbut.gif',
                dataURI: "iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJ2SURBVHja1JXPS1RRFMc/d95rxrHRXqPgD4gRp5EkAk0paqN/QKJgEBIt3ETt3PYH1CKI/gU3LSNR9zKILgLDsqCCKBDTHMd5zi/HmffuaTGT6HNydOHCAxcuh3s+77x7vudcJSKclfk4Qzu/cNPrUErt72VszAJGEBlGxEIEtLZx3TiuO6mmp+2Dsd76qSOOClyGhnowjHeIdOzm8qyuroEIV9paCPovlD9SLI6r+fmpU8FlYKAHw5hDxNpIJHn/+WtmE5kNovKXYPTOtatW08UgaA2OM65WViarwRGRQwtA+vt/Sl+fSG+vxIONMoH5GGgCmME/GA+ERKJRkc5OkUgkJa2tVlWW1yGx2IjEYiLRqBQjEZnBL0D0YEIz+EWam0XCYRHLkkQo9Kwa/KhabHsY2wbbJr2dIgdLgO05tbyV2kHv7OCk0+hcbhTw11SLTmc6lHYREbTeV2vRm8K261JA4wJaqT6gAUgeC085Ctct4QBpfP9tha1KsAsElAlSCtTMPIkmVwkqHNMgNiCABsLKXIdS7Q5NiI7vGQE2ARvBKP+u16w0gg3sKYMN9DfAqQlf06UppUzsCjwAXYBxqC7Qk0bIAu1mkAV3Lw5ka8IfwHJC3NkWM0gOyKN5g//pARlO5NAUgHajjjXtfH8Nb4H8kVFSrUMfQft9MzgXVkbXFydPg/hoxLcM2Fn0YEpprpv1ZEVnXjj5hwuwCCRPPFtuQ/cTo+7lDcN/z4+PP7pcsMu+8g19couzz93Cqx/wi/I6+eD6V7hBuNUNd28awTaAD+7u+kdYWoRV4Deweeqp6LF6IFSRrgPsAhnvoZrwc/MS/R0AJPdkX26aAbwAAAAASUVORK5CYII="
            },
            config: {
                img: 'config.gif',
                dataURI: "iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAH4SURBVHja7JU/aFNRFMZ/972XtEmbiLVqbFOKoC0Frd3EXScHEVyKbiI4FDcHFycRBMFFHF100UGQTp3FUSiKQyq41H/Ral6aNnl97557HAyhYNL2QevkB99wzvDj3I97zzWqyl7JYw/17+HGmC1dqVTM5rqnVPUvhxQ0pKAr+8d09fETjaJIoyjS5reqfh+ddLeHSk+3Y6hq98ktYI3h674C3oXziAgiQnPpA8sbLXNrqHT50fjxF/Pz8yZ1LBaIfR9zdBwJfKy1WGuJayErYonDkCvWu/jj2tzCVvCgWzNGEQM6OICIdPpJWMeKsF77iQeczfWfW75xUwGTAg6ijo3VBtbaTl/6sljneE6CB4xokJQ8/HK6yUHFsVZZQuIYfB8AFwQMqjKDj0MJlEwhn0uXeYSyoY4krFN79bqTOaVDJKr0A3kMAvhj5bTwP/aShOUHD5E4RkQIyqO4kSO0PI8EaGSz9J2aTgeP2zYiRG8W+XjnHhIniAjDc9ep9gVUMz7F2Ut4hw/2hJtui2vBDCiAa9erniF75jST9++SHT5A69NnXLPFwMQxXJIwMTVldgx/2YZv1pqB9WyG4sw0xZMn8PM5Gu/eU198y9VfX3YOf2byPfewtE+k7Uw9YFab6e75TuQ2Rbfr8O3U8/nvhsz/b66bfg8AeV4IgjxzluMAAAAASUVORK5CYII="
            },
            img: {
                img: 'img.gif',
                key: 'm',
                dataURI: "R0lGODlhFwAWAOZJAG5CHnNzoNPU%2F1hYhUREcYyMw25BHv%2F%2F%2F6Ok%2F4dXJmaw58SSX5hpPHtLHXK37HJOM4C%2F8V0xDtGgb3pbRZNjMXtNJ7iUcXRFGaPS%2FWw%2FFbWRbYBRIb2MWIpcMriGUoC%2F8JhoN%2BDQwJVlNsS2rY1dK2Ww52U4EpJiOK58SOCvfa58SW9CHdCfbY7G9tCfbJ5vQIJVLHK47LKBTdalcnRHIoJULGWx58qYZrOBTduqeNalc3G368uZZdyreGax55FjN%2BCufXNHIp5uQaFxQqt5RU8lCKJyQ%2F%2FMmczMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEkALAAAAAAXABYAAAfTgEmCg4SFhoeIiYqLjI2FIRZDkpOUkhYhhxoSR5ydnpwSGocgKUamp6imQCCHFD1GSLGys0Y5FIckMy9IJTYKJRgYPgpIQjokhwkuDEg7DjEHBwMHDkgMLAmHGzw%2FSB8fAxADAgQQSCc3G4cNCx1ILeMEAggFBEgdCw2HFxw1SOP0CBQYiAQGhwuHMniogERAgIcBCDxEUsFDhkMmcNCYxRFJEBkmDkVAsQKAyZMGDJg0oCLCoQciiMicSVOmiAeHRkwowrOnT54TRjgaSrSo0aGBAAA7"
            },
            audio: {
                img: 'audio.gif',
                dataURI: "R0lGODlhFwAWAOYAAAAAAP///wkHCAsJCiUhIycjJUM9QG5lauPj4ebm5eXl5B8cDyIeEeTj4D01IT83IyojFCchEyUfEj41IT82IkA3I9/c1t3a1N/d2eTj4TAnFy0lFtbRyLidcqSOa66bfa+egb+vldjHrM6+pMm5oMe3nsO0m9zLsNHBp8GymsCxmd3MsdTEq+7m2ePg2zYqGTMoGL2hdsOmesGkecapfceqfraeeceyksGtjsCsjtC7nNK+oc28o8Ozm9vJr9bFq9XEqtC/psa2nsW1ndnIrtPCqcu7o8m5odbHseHd19/b1dzY0uTi3z4wHTksG9jSytrVzjwuHEEyH0g4JdrTykc1IUQzIGJbU3BpYWBZUl9YUWJbVG1mX+Th3uXj4eTj4n52cHx0biAcGzo1NObl5ebm5v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAGYALAAAAAAXABYAAAfDgGaCg4SFhoeIiYqLiFWOj5COi1YtlZaXU4tSKzU1SA0uLJ0nUotNnDVlYmJeNDJETYtRqAljYwozMT9Ri06cOl1lZUw3HUVOiy8rOxZbAgJZFzhBL4swK0lXz89aVDwwixo+Zc8HB88ZRxqLGyJkAwMEBPBfQhuLEEBKWAX9BVxPekBYFAFFjiVgDBgIg+FDigiLJIywEQLKFwQcQHhIIWERAyMkSgwxkUKFyRQMFi2o8IDCBAcwYy5gRLOmzZs4FwUCADs="
            },
            video: {
                img: 'video.gif',
                dataURI: "R0lGODlhFwAWAOYAAAAAAP///93d3dXV1aOjo6KioqGhoaCgoJ2dnZiYmJWVlZSUlJKSko6OjoyMjIqKioWFhYODg3x8fHh4eHZ2dm9vb25ubmpqamNjY2BgYFpaWlVVVVJSUlFRUU1NTUxMTEhISEdHR0VFRUREREFBQUBAQDs7Ozk5OTg4ODc3NzY2NjQ0NDIyMjExMTAwMC4uLisrKyoqKikpKSYmJiUlJSEhIR0dHRgYGBUVFRQUFBAQEA0NDQwMDAcHBwUFBQMDAwICAv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEEALAAAAAAXABYAAAepgEGCg4SFhoeIiYqLjI2OQRArMI8gJCgBAQIVOj2JGx4imAMUNjmYAYwtMjWngpiMNjg7PpgAALW3qIi2uSW9vYkAEREFBxITCQoWFw4PAMESGhsdHyAjGCYqLBvPuxYgBAYmCNsxCzUh3YcAGSksLzE0NSA3OTon6oYAHDMMNg0O7vUAAsBFvkIARtjj0eNHQV4Gg2lzQbGixYOEeGncaOuRx48gQzIKBAA7"
            },
            'URL-http://': {
                img: 'url.gif',
                key: 'h',
                dataURI: "R0lGODlhFwAWAPeqAEt73cHX%2FJC5%2Bcnc%2FE%2BsKHG%2FQbPP%2B0yCzX283pG5%2BYay%2BISx%2BHe9YrLO%2B6LgaKPhap%2FC%2BpPXXZ3B%2BmqjnXK7XFaD3y9fwV2qizNjxVulisf6hmaT3FKE3dXk%2FWGrfZHWXFqUtWS2OGm8PDhsvo%2Bq4anI%2BmaK1IPKXGWlwWW3Q5m%2B%2BWmZ6ou9w%2FT3%2FWG0P73yfpm065a%2B7HfFR12XnjBduXnFT6rldSNQrK3M7azB7H%2FITXGe63ac53DAQXGPzHKm93ur%2BJyx3M%2Fb83CwmY%2B4%2BYu1%2BUZtvHu%2FbkZ50GfAXPP2%2FW7GcnbDTU6Fr3ic5oii2b%2FW%2B4Wj4H2Yz3zGSpvE0YLD3oK%2BjLXYxaTF%2BqjkbXTERYyq54LKT4HMT6bG%2BnGV357B%2BrPsdm27PlWHydLi%2FGevfVB60GmQ35O6%2BV2SvM%2Fg%2FGe7O7nve%2FH0%2BtLe9q2%2F5HnGSVStNn%2B6mo3RWI%2FGjUt41Jm91LHrdXGp73if6aDKxLvN8mi6O5bYX4Ok6GWdpbvT%2B6PQqbrT%2B4vH%2BqXF%2BrHN%2B6zncXK%2BQnDEU6PE%2BpHGmWy5mnewwvP2%2FJ%2FeZnim8oCw67XH7IK10Ii%2BqF2xRW6qwaDfZ8TQ6a7L%2B1KrNF5%2Fwn7HTIK3wnO2ZW2%2BR1OrPXW9ZGOH0XPBRFJ5yWuS4kuAzqHfaGym4P%2F%2F%2FwAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKoALAAAAAAXABYAAAj%2FAFUJHEiwoMGDCBMqXKjQjZ8KACI62cNQIIw0ik4gClPDDg9SLRZu%2BWMjwpIkWgKRCZDnjJKEOWaYMmSpiwYKV9QEmDThC8JGdRg4ynKHzQs6HQYIkvOhiZCDkcbAEeHggScmRwZAaUCoDIgoB0lsIPCpjww9VkABMlBCApFHZg6a2CEpBqU1hXBQweQFDBoPKTAcDLVCQQJOBFhgSQRBhQBGPeZYOPiEAxBImbjwcTFEQJEFlUR1GnXwDZIfGQpM2aQjletUKF6nMtiGBp4LYg65RsUbVarevg0GKYUgTojfspMHL%2BjjQJVFyAf9RmVkNvKDUkacQp789XKDlzTdD5jOm%2Fx3hbJVpa%2FIvr3BgAA7"
            },
            smilies: {
                img: 'smilies.gif',
                dataURI: "R0lGODlhFwAWANU6AP%2FjAP%2FtAP%2F2AP7aAP%2FmAPnRAP%2FqAP%2F5AN%2BsAO7BAP%2FpAP%2FyAOKxAO2%2BAP%2F4APnSAP7bAP%2F7AMaQAPLGANSfAP%2FoAP%2FxAP%2F1ANSgAPnTAPrTAP%2F9AP%2F3AMyXAP%2FfAMeRAPfNAMGKAM2XAO%2FCAP%2F8ANilAOi6APbMAP%2F%2BAPvUAOq7APvWAP%2FzALyFAP7dAPzXAOSyANypAP%2FeALqDAP%2FuAP%2F0APXLAP%2F%2FAP%2F%2F%2FwAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAACH5BAEAADoALAAAAAAXABYAAAayQJ1wSCwaj8ikMsdkKo1MgsFAgDifupyidohEHKxKJvfMBQ6om1otUBTIyBzBcWOumRdAAg5dbHJqgIB1AQ98RDkeAmuMaiQWAwiHQjkAHE2YmC4wk1kAAjk4OKGipDkDDJ2nC6aio6UaJaonBq2lpRMSnVkQNKGkrzkpqXEJMgFMrkwvKiG7lA0rAJkFJh%2FPQzkIIyAPBTYNMS3YiDkiGBQdM1dYlJjZ7%2B1FTfJH5PU6QQA7"
            }
        };

        keys = {};

        for (var iX in codes) {
            var tImg = d[c]("IMG"),
                curr = codes[iX]
            if (curr.key) keys[curr.key] = iX;
            tImg.src = UseDataURLs ? (curr.dataURI ? 'data:image/gif;base64,' + curr.dataURI : base + curr.img) : base + curr.img
            tImg.width = 23;
            tImg.height = 22
            tImg.title = iX
            tImg.addEventListener("click", function () {
                ForMat(TxtArea, this.title.split('-'), this)
            },
            false)
            tDiv.appendChild(tImg);
        }

        var Font = {
            size: ["size", "50", "85", "100", "150", "200"],
            font: ["font", "宋体", "微软雅黑", "楷体_GB2312", "黑体", "Arial", "Times new roman", "Courier New", "Century Gothic", "Verdana", "Tahoma", "Comic Sans MS", "Microsoft Sans Serif", "Georgia", "Impact", "Lucida Sans", "Roman", "Script", "Segoe UI", "Small Fonts", "Terminal"],
            color: ["color", "black", "sky blue", "royal blue", "blue", "dark-blue", "orange", "orange-red", "crimson", "red", "firebrick", "dark red", "green", "limegreen", "sea-green", "deeppink", "tomato", "coral", "purple", "indigo", "burlywood", "sandy brown", "sienna", "chocolate", "teal", "silver", "gray", "yellow", "lime", "darkorange", "khaki", "royalblue", "floralwhite"]
        }

        rDiv.className = "flRight";
        for (var iX in Font) {
            var tS = d[c]("select"),
                curr = Font[iX],
                coloring = iX == "color";
            for (var iXX = 0; iXX < curr.length; iXX++) {
                var cOpt = new Option(curr[iXX]);
                if (coloring && iXX) cOpt.style.color = curr[iXX].replace(/\W/, "");
                tS.add(cOpt);
            }
            tS.options[0].selected = 1;
            tS.name = iX;
            tS.title = iX;
            tS.addEventListener("change", function () {
                if (this.selectedIndex) {
                    ForMat(TxtArea, [this.name, this.value.toLowerCase().replace(new RegExp((this.name == 'color' ? '\\W' : 'A'), 'g'), '')]);
                    this.selectedIndex = 0
                }
            },
            false);
            rDiv.appendChild(tS);
        }

        tDiv.appendChild(rDiv);


		smDiv.style.cssText = "position: absolute; width: " + TxtArea.offsetWidth + "px; background: #ececec; border: 1px solid #c0c0c0; border-bottom: none;";
        function AddSmilies() {
            if (this.Added) return;
            smDiv.className = "smilies";
            smDiv.style.display = "none";
            for (var iX in Smilies) {
                var tImg = d[c]('IMG'),
                    curr = base + Smilies[iX];
                tImg.src = curr;
                tImg.title = iX;
                tImg.addEventListener("click", function () {
                    ForMat(TxtArea, ['SMADD', ' ' + this.title + ' '])
                },
                false);
                new Image().src = curr;
                smDiv.appendChild(tImg);
            }
            tDiv.appendChild(smDiv);
            this.Added = 1;
        }

        if (Open_Smilies) ForMat(TxtArea, ["SMILIES"], tImg);
        else if (PreloadSmilies) AddSmilies();

        var S = d[g]("OETCSS") || d[c]("style"),
            t1 = "DIV.OperaEditTools";
        S.appendChild(document.createTextNode(" " + t1 + ">IMG { background:#E6E6E6 none repeat scroll 0%; border:1px solid #CCCCCC; margin: 3px 2px 5px 0pt; } " + t1 + ">IMG:hover { background-color:#FFFFFF;border:1px outset #DADADA } " + t1 + ">IMG:active {border-style:inset} " + t1 + "," + t1 + " select { font-size:11px } " + t1 + "{ border-top:1px solid #A8A8A8;background : #ececec} " + t1 + ">Div.flRight { float:right } " + t1 + '> .smilies {padding: 8px 0; opacity: 0.75;} ' + t1 + '> .smilies img {margin:2px 3px;background:transparent;border:none;cursor:hand} ' + t1 + " select { margin:7px 0 0 2px } " + 'div.fpost ' + t1 + '>img{width:22px;margin-right:0}  div.fpost ' + t1 + '{width:100%!important} ' + (Styles.Styles || '')));
        S.type = "text/css";
        S.id = "OETCSS";
        d.getElementsByTagName("head")[0].appendChild(S);

        Where.parentElement.insertBefore(tDiv, Where);

        var cst = tDiv.offsetTop + tDiv.offsetHeight + 1;
        if (cst < (TxtArea.offsetTop)) tDiv.style.marginBottom = "-" + (TxtArea.offsetTop - (cst)) + "px";

        if (!Styles.NoAutoAdjust) {
            var adjust = function () {
                tDiv.style.width = TxtArea.offsetWidth;
            }
            var qr;
            if (qr = d[g]("quickreply")) qr.style.marginBottom = 0;
            adjust();
            document.addEventListener('load', adjust, false);
            document.addEventListener('resize', adjust, false);
        }

        TxtArea.addEventListener("keypress", function (e) {
            var key = String.fromCharCode(e.keyCode).toLowerCase()
            if ((key in keys) && e.target.hotKey && !e.ctrlKey) {
                ForMat(TxtArea, keys[key].split("-"));
                e.preventDefault();
                e.target.hotKey = 0;
            } else if (e.keyCode == 17) {
                e.target.hotKey = !e.target.hotKey;
            } else e.target.hotKey = 0;
        },
        false);


		var iInterval = 0;
        function ForMat(TxtArea, q, elem) {
            var value = q[1] || '';
            q = q[0];
            if (q == "smilies") {
                AddSmilies();
                var temp = smDiv.style,
                    temp2 = elem.style,
                    hid = temp.display ==='none';
                temp.display = hid ? '' : 'none';
                temp2.backgroundcolor = hid ? "#C6C6C6" : "";
                temp2.borderStyle = hid ? "ridge" : "";

				if (hid) {
					iInterval = setInterval(function () {
						smDiv.style.top = tDiv.offsetTop - smDiv.offsetHeight;
						smDiv.style.left = tDiv.offsetLeft;
					}, 100);
					smDiv.style.width = tDiv.clientWidth;
				} else {
					clearInterval(iInterval);
				}
                return
            };
            var CurPos = TxtArea.selectionStart;
			var sText_Pre = TxtArea.value.slice(0, CurPos);
			var sText_Suf = TxtArea.value.slice(TxtArea.selectionEnd);
            TxtArea.focus();
            var sel = TxtArea.value.slice(CurPos, TxtArea.selectionEnd);
                selTxt = sel || "";
            if (q == "SMADD") {
				TxtArea.value = sText_Pre + value + sText_Suf;
				TxtArea.selectionEnd = TxtArea.selectionStart = CurPos + value.length;
                return;
            } else if (q == 'list') {
                value = prompt("\n  空\t无序列表\n  1\t数字列表\n  a/A\t字母列表\n  i/I\t罗马数字列表", '1')
                if (value == null) return;
                selTxt = "\n[*]" + selTxt.replace(/\n/g, "\n[*]") + '\n'
            } else if (q == 'opbut') {
				if (selTxt.length) {
					value = selTxt;
				} else {
					value = prompt("请输入按钮调用的命令");
					if (value == null) return;
				}
				if (value.indexOf("#") !== -1) {
					alert('注意，该按钮所执行的命令包含 "#" 号，只能通过拖拽添加');
				}
				value = value.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
				selTxt = "按钮名称";
            } else if (q == 'config') {
				if (selTxt.length) {
					if (selTxt.indexOf('opera:config#') === 0) {
						q = 'config';
					} else {
						q = "cfg";
					}
				} else {
					value = prompt("请输入以 opera 开头的链接的地址或首选项编辑器的选项");
					if (value == null) return;
					if (value.search(/^opera:/) === 0) {
						selTxt = value;
					} else {
						selTxt = value;
						value = "";
						q = "cfg";
					}
				}
            } else if (q == "URL") {
                if (selTxt.length) {
                    if (selTxt.search(/^https?:\/\//) == 0) {
                        value = selTxt;
                        selTxt = prompt("请输入链接的文字", value);
						if (value === selTxt) {
							value = "";
						}
                        if (selTxt == null) return;
                    } else {
                        value = prompt("请输入链接的地址", value);
                    }
                } else {
                    selTxt = value = prompt("请输入链接的地址", value);
                }
                if (value == null) return;
            } else if (q == "video") {
                if (!selTxt.length) {
                    selTxt = prompt("请输入视频所在的网址", "");
                    if (!selTxt) return;
                    if (selTxt.indexOf("http://v.youku.com/") == 0) {
                        selTxt = selTxt.match(/\/id_([^.]+)\.html/i)[1];
                        q = "youku";
                    } else if (selTxt.indexOf("http://www.tudou.com/") == 0) {
                        selTxt = selTxt.match(/\/view\/([^\/]+)\//i)[1];
                        q = "tudou";
                    } else if (selTxt.indexOf("http://you.video.sina.com.cn/") == 0) {
                        if (selTxt.match(/\/b\/(\d{8}-\d{10})\.html/i)) {
                            selTxt = selTxt.match(/\/b\/(\d{8}-\d{10})\.html/i)[1];
                        } else if (selTxt.match(/&uid=\d{10}/i) && selTxt.match(/#\d{8}/) != -1) {
                            selTxt = selTxt.match(/#(\d{8})/)[1] + "-" + selTxt.match(/&uid=(\d{10})/i)[1];
                        }
                        q = "sinavideo";
                    } else if (selTxt.indexOf("http://video.google.com/") == 0) {
                        selTxt = selTxt.match(/docid=-?(\d+)/i)[1];
                        q = "googlevideo";
                    } else if (selTxt.indexOf("http://www.youtube.com/") == 0) {
                        selTxt = selTxt.match(/v=(\w{11})/i)[1];
                        q = "youtube";
                    }
                }
            }

            // if (sel) {
				sel = "[" + q + (value ? "=" + value : "") + "]" + selTxt + "[/" + q + "]";
				if (q === "opbut") {
					sel += "\n[code]" + value + "[/code]\n";
				}
				TxtArea.value = sText_Pre + sel + sText_Suf;
				TxtArea.selectionEnd = TxtArea.selectionStart;
                // sel.select();
            // }

            if (AutoReSelect) {
                var strt = CurPos + q.length + 2 + (value ? 1 + value.length : 0)
                TxtArea.setSelectionRange(strt, strt + selTxt.length);
            }

			setTimeout(function(){TxtArea.focus();}, 0);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        var codTT = document.getElementById("message");
        if (codTT) {
            var iDivWidth = codTT.offsetWidth - 2;
            opera.AddCodeTools(codTT, codTT, {
                Styles: "div.OperaEditTools {width: " + iDivWidth + "px !important; margin:0 auto; clear:both;}" + "div.OperaEditTools {text-align: left; border:1px solid #c0c0c0; border-bottom:none;}" + "div.OperaEditTools>IMG {margin: 3px 0px 2px 0px;}" + "div.OperaEditTools>IMG:first-child {margin-left: 3px;}" + "div.flRight {margin-right: 3px;}"
            });
            return;
        }
    },
    false);
})(window.opera || window);