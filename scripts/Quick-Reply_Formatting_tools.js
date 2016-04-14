// ==UserScript==
// @name        -    MyOpera: Formatting tools in Quick-Reply
// @author      -    Ayush
// @version     -    1.2.7
// @description -    This userjs adds formatting tools in- 
//                     - 'Quick Reply' in forums
//                     - 'Write/Edit comment' area of blog posts
//                     - Private Message Reply page
//                     - Add Comment
//                   and if the quick-edit script(author:Jo鉶) is installed, in Quick Edit box.
// @include http://my.opera.com/*/forums/topic.dml?id=*
// @include http://my.opera.com/*/blog/*
// @include http://my.opera.com/*/comments/editcomment.dml*
// @include http://my.opera.com/*/messages/reply.dml?id=*
// @include http://widgets.opera.com/widget/*
// @include http://widgets.opera.com/comment/*
// ==/UserScript==

(function(opera){
var AutoReSelect    = 1, //-- set to 0 to turn off the 'auto-reselect/auto-reposition' cursor setting.
    PreloadSmilies  = 0, //-- preload the smiles ..
    UseDataURLs     = 1, //-- use data:image urls.
    Open_Smilies    = 0; //-- Set to 1 to auto-open the smilies panel

opera.AddCodeTools=function(TxtArea,Where,Styles){
if(!TxtArea||!Where)return

var d=document,w=window,g='getElementById',c='createElement',Styles=Styles||{};

var tDiv=d[c]("DIV"),rDiv=d[c]("DIV"),smDiv=d[c]('DIV');
tDiv.className="OperaEditTools"

var base='http://my.opera.com/community/graphics/ui/',
codes={
    B                  :{img:'bold.gif',        key:'b',  dataURI:"R0lGODlhFwAWAJECAAAAANTQyP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAInlI%2Bpy%2B0Po5y0gYsvxSHgyXmaFH5kNp5AZ0ZlCr2Ailb2jef6zicFADs%3D"},
    I                  :{img:'italic.gif',      key:'i',  dataURI:"R0lGODlhFwAWAJECAAAAAICAgP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIjlI%2Bpy%2B0Po5w0gnuruUGLkHmcBwKeMGrlmVIYdsbyTNe2UwAAOw%3D%3D"},
    U                  :{img:'underline.gif',   key:'u',  dataURI:"R0lGODlhFwAWAJECAAAAAICAgP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIrlI%2Bpy%2B0Po5y0gQsEzvIeP4Ea15FiJJ5QSqJmuwKBEKgxVuXIxuv%2BDwxWCgA7"},
    'ALIGN-left'       :{img:'alignleft.gif',             dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIgjI%2Bpy%2B0Po5yg2nunDhjvz3UiGIkWqZkd%2BqgAC8fyPBcAOw%3D%3D"},
    'ALIGN-center'     :{img:'aligncenter.gif', key:'a',  dataURI:"R0lGODlhFwAWAJEAAAAAAP%2F%2F%2F%2F%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAIglI%2Bpy%2B0Po5Sg2nunPhjv3YXAp4kVOZkeGqnsC8fyjBQAOw%3D%3D"},
    'ALIGN-right'      :{img:'alignright.gif',            dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIgjI%2Bpy%2B0Po5Sg2nunThjv2YXA94kVGZkeCprsC8fybBQAOw%3D%3D"},
    'ALIGN-justify'    :{img:'alignjustify.gif',          dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIhjI%2Bpy%2B0Po5Sg2nunDrjbPXkeSIkYGZkn%2BqgZC8fyTAcFADs%3D"},
    LIST               :{img:'listbullet.gif',  key:'l',  dataURI:"R0lGODlhFwAWAJECAAAAgAAAAP%2F%2F%2FwAAACH5BAEAAAIALAAAAAAXABYAAAImlI%2Bpy%2B0PYwJUKgpM2Jw3bIXiCI5C2aVfZbbuxJJs2q3Zi%2Bf67hQAOw%3D%3D"},
    QUOTE              :{img:'quote.gif',       key:'q',  dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAImjI%2Bpy%2B0Po5y02osDOBuB%2FimdJoIjh4qpZ6rG%2BbbemtX2jed6VQAAOw%3D%3D"},
    CODE               :{img:'code.gif',        key:'c',  dataURI:"R0lGODlhFwAWALMAAAAAALS0tKioqJycnJCQkHh4eGxsbGBgYFRUVDAwMBgYGAwMDAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAXABYAAAQ5EMhJq7046827%2F2AojlIxCcRXKMo0LEmqDaxJBQccZAZgVwEEYKBZKX44mGyzmhBipKh0Sq1ar5QIADs%3D"},
    IMGLEFT            :{img:'imgleft.gif',               dataURI:"R0lGODlhFwAWAOZIAMzMzAAAAP%2F%2F%2F6JyQ%2F%2FMmaFxQqt5RU8lCG5CHnNzoNPU%2F4yMw1hYhUREcW5BHpNjMYBRIXK37IdXJrWRbZhpPI1dK4C%2F8JhoN7iUcXtLHYpcMmaw52Ww56PS%2FYC%2F8aOk%2F9Ggb%2BDQwL2MWHRFGeCvfXNHImU4Etalcp5vQGWx52w%2FFcSSX3RHIpJiONyreK58ScqYZtCfbV0xDp5uQcuZZXtNJ5VlNsS2ra58SNuqeHpbRXK47G9CHbiGUpFjN2ax5%2BCufdalc3JOM7KBTdCfbHG3647G9oJVLP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEgALAAAAAAXABYAAAfTgEiCg4SFhoeIiYqLjI2FIRgFkpOUkhghhxMgBJydnpwgE4cXJAOmp6imQBeHDy4DALGyswM5D4cVJygAHCkbHB0dPxsAM0EVhxJEFABFETsCAgwCEQAUMRKHEDQ%2BABYWDB4MCg0eAC0wEIcZARoARuMNCh8LDQAaKxmHAQIBAOP0GiwYCOCIiBGG%2BPUDoCCBwwQNHAKo0UNFIYUBWMzaCKDEEBOEMOLggaCkSQcOSjp4IeNitAAGYsqcGdOGkIQvD%2BjcyfOAjhv7%2BjnaN7So0aGBAAA7"},
    IMG                :{img:'img.gif',         key:'m',  dataURI:"R0lGODlhFwAWAOZJAG5CHnNzoNPU%2F1hYhUREcYyMw25BHv%2F%2F%2F6Ok%2F4dXJmaw58SSX5hpPHtLHXK37HJOM4C%2F8V0xDtGgb3pbRZNjMXtNJ7iUcXRFGaPS%2FWw%2FFbWRbYBRIb2MWIpcMriGUoC%2F8JhoN%2BDQwJVlNsS2rY1dK2Ww52U4EpJiOK58SOCvfa58SW9CHdCfbY7G9tCfbJ5vQIJVLHK47LKBTdalcnRHIoJULGWx58qYZrOBTduqeNalc3G368uZZdyreGax55FjN%2BCufXNHIp5uQaFxQqt5RU8lCKJyQ%2F%2FMmczMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEkALAAAAAAXABYAAAfTgEmCg4SFhoeIiYqLjI2FIRZDkpOUkhYhhxoSR5ydnpwSGocgKUamp6imQCCHFD1GSLGys0Y5FIckMy9IJTYKJRgYPgpIQjokhwkuDEg7DjEHBwMHDkgMLAmHGzw%2FSB8fAxADAgQQSCc3G4cNCx1ILeMEAggFBEgdCw2HFxw1SOP0CBQYiAQGhwuHMniogERAgIcBCDxEUsFDhkMmcNCYxRFJEBkmDkVAsQKAyZMGDJg0oCLCoQciiMicSVOmiAeHRkwowrOnT54TRjgaSrSo0aGBAAA7"},
    IMGRIGHT           :{img:'imgright.gif',              dataURI:"R0lGODlhFwAWAOZIAMzMzAAAAP%2F%2F%2F6JyQ%2F%2FMmaFxQqt5RU8lCG5CHnNzoIyMw1hYhdPU%2F0REcW5BHrWRbaPS%2FYpcMoBRIXtLHZhpPIC%2F8JhoN41dK7iUcZNjMYdXJnK37Gaw52Ww54C%2F8aOk%2F9Ggb%2BDQwMS2rb2MWOCvfXRHInG363pbReCufZ5vQGw%2FFcSSX7OBTdyreMqYZnJOM8uZZY7G9l0xDntNJ55uQXRFGWU4EtuqeNCfbWWx53K47JFjN29CHbiGUpVlNtalcoJULHNHIpJiOK58SNCfbGax59alc658Sf%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEgALAAAAAAXABYAAAfVgEiCg4SFhoeIiYqLjI2FIRgFkpOUkhghhw8gBJydnpwgD4cWJAOmp6imKBaHGS0DALGyswM3GYcXPykAHTkcHRAQRRwANEYXhxpEFAAmGzoCAgsCGwAUOBqHEjA7ABUVCx4LDA0eAEIuEocTKxEAMeMNDB8KDQARAROHNSNAAOP0GigYCCCAgACHVPSYAYBBgocJGjwsGA1hIRssSszaCCCIwYOFZAzhgaCkSQcOSjo48tGioBc%2BDMicSVNmy0IiThzYybPngZuOCBl0GXQQ0aJIGwUCADs%3D"},
    'URL-http://'      :{img:'url.gif',         key:'h',  dataURI:"R0lGODlhFwAWAPeqAEt73cHX%2FJC5%2Bcnc%2FE%2BsKHG%2FQbPP%2B0yCzX283pG5%2BYay%2BISx%2BHe9YrLO%2B6LgaKPhap%2FC%2BpPXXZ3B%2BmqjnXK7XFaD3y9fwV2qizNjxVulisf6hmaT3FKE3dXk%2FWGrfZHWXFqUtWS2OGm8PDhsvo%2Bq4anI%2BmaK1IPKXGWlwWW3Q5m%2B%2BWmZ6ou9w%2FT3%2FWG0P73yfpm065a%2B7HfFR12XnjBduXnFT6rldSNQrK3M7azB7H%2FITXGe63ac53DAQXGPzHKm93ur%2BJyx3M%2Fb83CwmY%2B4%2BYu1%2BUZtvHu%2FbkZ50GfAXPP2%2FW7GcnbDTU6Fr3ic5oii2b%2FW%2B4Wj4H2Yz3zGSpvE0YLD3oK%2BjLXYxaTF%2BqjkbXTERYyq54LKT4HMT6bG%2BnGV357B%2BrPsdm27PlWHydLi%2FGevfVB60GmQ35O6%2BV2SvM%2Fg%2FGe7O7nve%2FH0%2BtLe9q2%2F5HnGSVStNn%2B6mo3RWI%2FGjUt41Jm91LHrdXGp73if6aDKxLvN8mi6O5bYX4Ok6GWdpbvT%2B6PQqbrT%2B4vH%2BqXF%2BrHN%2B6zncXK%2BQnDEU6PE%2BpHGmWy5mnewwvP2%2FJ%2FeZnim8oCw67XH7IK10Ii%2BqF2xRW6qwaDfZ8TQ6a7L%2B1KrNF5%2Fwn7HTIK3wnO2ZW2%2BR1OrPXW9ZGOH0XPBRFJ5yWuS4kuAzqHfaGym4P%2F%2F%2FwAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKoALAAAAAAXABYAAAj%2FAFUJHEiwoMGDCBMqXKjQjZ8KACI62cNQIIw0ik4gClPDDg9SLRZu%2BWMjwpIkWgKRCZDnjJKEOWaYMmSpiwYKV9QEmDThC8JGdRg4ynKHzQs6HQYIkvOhiZCDkcbAEeHggScmRwZAaUCoDIgoB0lsIPCpjww9VkABMlBCApFHZg6a2CEpBqU1hXBQweQFDBoPKTAcDLVCQQJOBFhgSQRBhQBGPeZYOPiEAxBImbjwcTFEQJEFlUR1GnXwDZIfGQpM2aQjletUKF6nMtiGBp4LYg65RsUbVarevg0GKYUgTojfspMHL%2BjjQJVFyAf9RmVkNvKDUkacQp789XKDlzTdD5jOm%2Fx3hbJVpa%2FIvr3BgAA7"},
    'EMAIL'            :{img:'email.gif',       key:'e',  dataURI:"R0lGODlhFwAWAMQbAKKioe3s7fj4%2BOXk5Gtra5ucmtrY2vj4%2BZubmtPR0%2BPi5OTi45OTkvn4%2BHN0c5OSkX59fYmIiIiIiH1%2BfeDg4XN0dICAgKGhoGVlZba2tv%2F%2F%2F%2F%2F%2F%2FwAAAAAAAAAAAAAAACH5BAEAABsALAAAAAAXABYAAAVh4CaOZGmeaKqubOu%2BcNxedG3XKmJpQi8cgsbBUshldoFkUmPJFFMMzVEzqDIzmodKollMKVeFJqKaaAyAaRNg0EBUFU06cczQARqHipDW%2BP9SAAQqGIWGh4YyiouMjY6LIQA7"},
    S                  :{img:'strike.gif',      key:'s',  dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIjjI%2Bpy%2B0Po5wH2EttBZnXrlEbJo7Rhaahs65nWsbyTNf2TRcAOw%3D%3D"},
    SUP                :{img:'sup.gif',                   dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAIrjI%2Bpy%2B0Po0QggotDfvd0XXGhEX4ONoJmg6YTuUJpLHquiL76zvf%2BDwxKCgA7"},
    SUB                :{img:'sub.gif',                   dataURI:"R0lGODlhFwAWAIABAAAAAP%2F%2F%2FyH5BAEAAAEALAAAAAAXABYAAAInjI%2Bpy%2B0Po5wH2EttBZnXrlEbJo4ZEkppGl1kuXjlO8s1HLj4zjsFADs%3D"},
    SMILIES            :{img:'smilies.gif',               dataURI:"R0lGODlhFwAWANU6AP%2FjAP%2FtAP%2F2AP7aAP%2FmAPnRAP%2FqAP%2F5AN%2BsAO7BAP%2FpAP%2FyAOKxAO2%2BAP%2F4APnSAP7bAP%2F7AMaQAPLGANSfAP%2FoAP%2FxAP%2F1ANSgAPnTAPrTAP%2F9AP%2F3AMyXAP%2FfAMeRAPfNAMGKAM2XAO%2FCAP%2F8ANilAOi6APbMAP%2F%2BAPvUAOq7APvWAP%2FzALyFAP7dAPzXAOSyANypAP%2FeALqDAP%2FuAP%2F0APXLAP%2F%2FAP%2F%2F%2FwAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAACH5BAEAADoALAAAAAAXABYAAAayQJ1wSCwaj8ikMsdkKo1MgsFAgDifupyidohEHKxKJvfMBQ6om1otUBTIyBzBcWOumRdAAg5dbHJqgIB1AQ98RDkeAmuMaiQWAwiHQjkAHE2YmC4wk1kAAjk4OKGipDkDDJ2nC6aio6UaJaonBq2lpRMSnVkQNKGkrzkpqXEJMgFMrkwvKiG7lA0rAJkFJh%2FPQzkIIyAPBTYNMS3YiDkiGBQdM1dYlJjZ7%2B1FTfJH5PU6QQA7"}
  },
keys={}

for(var iX in codes){
    var tImg = d[c]("IMG"),curr=codes[iX]
    if(curr.key)keys[curr.key]=iX;
    tImg.src=UseDataURLs?(curr.dataURI?'data:image/gif;base64,'+curr.dataURI:base+curr.img):base+curr.img
    tImg.width=23;tImg.height=22
    tImg.title=iX
    tImg.addEventListener("click",function(){ ForMat(TxtArea,this.title.split('-'),this) },false)
    tDiv.appendChild(tImg)
}

var Font=
    {
        SIZE :['SIZE','1','2','3','4','5','6','7'],
        FONT :['FONT','Arial','Times new roman','Courier New','Century Gothic','Verdana','Tahoma','Comic Sans MS','Microsoft Sans Serif','Georgia','Impact','Lucida Sans','Roman','Script','Segoe UI','Small Fonts','Terminal'],
        COLOR:['COLOR','black','sky blue','royal blue','blue','dark-blue','orange','orange-red','crimson','red','firebrick','dark red','green','limegreen','sea-green','deeppink','tomato','coral','purple','indigo','burlywood','sandy brown','sienna','chocolate','teal','silver','gray','yellow','lime','darkorange','khaki','royalblue','floralwhite']
    },ii=0

rDiv.className="flRight"
for(var iX in Font){
    var tS=d[c]("select"),curr=Font[iX],coloring=iX=='COLOR'?1:0
    for(var iXX=0;iXX<curr.length;iXX++){
      var cOpt=new Option(curr[iXX])
      if(coloring && iXX)cOpt.style.color=curr[iXX].replace(/\W/,'')
      tS.add(cOpt)       
     }
     tS.options[0].selected=1;
     tS.name=iX;tS.title=iX
     tS.addEventListener("change",function(){ if(this.selectedIndex){ ForMat(TxtArea,[this.name,this.value.toLowerCase().replace(new RegExp((this.name=='COLOR'?'\\W':'A'),'g'),'')]);this.selectedIndex=0 } },false)
    rDiv.appendChild(tS)
}
tDiv.appendChild(rDiv)

base="http://my.opera.com/community/graphics/smilies/"
var Smilies={
    ":)"        : 'smile.gif',       ":("         : 'frown.gif',        ":o"         : 'blush.gif',
    ":D"        : 'bigsmile.gif',    ";)"         : 'wink.gif',         ":p"         : 'tongue.gif',
    ":cool:"    : 'cool.gif',        ":awww:"     : 'awww.gif',
    ":rolleyes:": 'rolleyes.gif',    ":mad:"      : 'mad.gif',
    ":eek:"     : 'eek.gif',         ":worried:"  : 'worried.gif',      ":yuck:"     : 'yuck.gif',
    ":irked:"   : 'irked.gif',       ":happy:"    : 'pleased.gif',      ":eyes:"     : 'bigeyes.gif',
    ":ko:"      : 'knockout.gif',    ":left:"     : 'left.gif',         ":right:"    : 'right.gif',
    ":whistle:" : 'whistle.gif',     ":zip:"      : 'zipped.gif',       ":sst:"      : 'sst.gif',
    ":angel:"   : 'angel.gif',       ":devil:"    : 'devil.gif',        ":cat:"      : 'cat.gif',
    ":clown:"   : 'sadclown.gif',    ":king:"     : 'king.gif',         ":queen:"    : 'queen.gif',
    ":zzz:"     : 'zzz.gif',         ":alien:"    : 'alien.gif',        ":lol:"      : 'haha.gif',
    ":faint:"   : 'faint.gif',       ":psmurf:"   : 'papasmurf.gif',    ":smurf:"    : 'smurf.gif',
    ":wine:"    : 'wine.gif',        ":beer:"     : 'beeer.gif',        ":star:"     : 'star.gif',
    ":cry:"     : 'weeping.gif',     ":insane:"   : 'scared.gif',       ":bomb:"     : 'bomb.gif',
    ":love:"    : 'love.gif',        ":flirt:"    : 'flirt.gif',
    ":pirate:"  : 'pirate.gif',      ":spock:"    : 'spock.gif',        ":beard:"    : 'beard.gif',
    ":up:"      : 'thumbsup.gif',    ":down:"     : 'thumbsdown.gif',   ":cheers:"   : 'cheers.gif',
    ":idea:"    : 'idea.gif',        ":confused:" : 'confused.gif',     ":wait:"     : 'waiting.gif',
    ":coffee:"  : 'coffee.gif',      ":sing:"     : 'sing.gif',         ":ninja:"    : 'ninja.gif',
    ":knight:"  : 'knight.gif',      ":chef:"     : 'chef.gif',         ":hat:"      : 'party.gif',
    ":wizard:"  : 'wizard.gif',      ":drunk:"    : 'drunk.gif',        ":sherlock:" : 'detective.gif',
    ":furious:" : 'furious.gif',     ":yikes:"    : 'yikes.gif',        ":troll:"    : 'troll.gif',
    ":bandit:"  : 'bandit.gif',      ":jester:"   : 'jester.gif',       ":yes:"      : 'yes.gif',
    ":no:"      : 'no.gif',          ":headbang:" : 'headbang.gif',     ":heart:"    : 'heart.gif',
    ":doh:"     : 'doh.gif',         ":nervous:"  : 'nervous.gif',      ":banana:"   : 'banana.gif',
    ":monkey:"  : 'monkey.gif',      ":cow:"      : 'cow.gif',          ":pingu:"    : 'pingu.gif',
    ":bug:"     : 'bug.gif',         ":rip:"      : 'rip.gif',
    ":norris:"  : 'norris.gif',      ":hi:"       : 'hi.gif',           ":bye:"      : 'bye.gif'
}

var AddSmilies=function(){
 if(this.Added)return;
 smDiv.className="smilies";smDiv.style.display="none"
 for(var iX in Smilies){
    var tImg=d[c]('IMG'),curr=base+Smilies[iX]
    tImg.src=curr
    tImg.title=iX
    tImg.addEventListener("click",function(){ ForMat(TxtArea,['SMADD',this.title+' ']) },false);
    new Image().src=curr
    smDiv.appendChild(tImg)
 }
 tDiv.appendChild(smDiv);
 this.Added=1
}

if(Open_Smilies)ForMat(TxtArea,["SMILIES"],tImg);else if(PreloadSmilies)AddSmilies();

    var S=d[g]("OETCSS")||d[c]("style"),t1="DIV.OperaEditTools",bgImage=UseDataURLs?"data:image/gif;base64,R0lGODlhAQBAANUAAN3d3tvb3Ovr6%2B3t7ebm59%2Ff3%2Bjo6OTk5N7e3uDg4Nzc3ezs7Nra2tvb2%2Brq6%2Brq6trb2unq6uLi497e3eHi4e3s7e3u7d3c3eXl5enp6tzc3uPi4ufn6Onp6ezs6%2B7t7ezt7Ojn5%2BLi4eHh4efn5%2BXm5eTk4%2BDg4eHg4OPj49rb2%2BXk5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAABAEAAAAY4wMFnYBmAKgvPQsB0PCKZjsEQ4pAIBExpdTiYUhuJiDI6oRKJQgGBmADeb81FoQgEGgFVgwFhBAEAOw%3D%3D":"/community/graphics/blogform/bg.gif";
    S.text+=" "+
            t1+">IMG { background:#E6E6E6 none repeat scroll 0%; border:1px solid #CCCCCC; margin: 3px 2px 5px 0pt; } "+
            t1+">IMG:hover { background-color:#FFFFFF;border:1px outset #DADADA } " +
            t1+">IMG:active {border-style:inset} "+
            t1+","+t1+" select { font-size:11px } " +
            t1+"{ border-top:1px solid #A8A8A8;background : #DADADA url('"+bgImage+"') repeat-x scroll left top } " +
            t1+">Div.flRight { float:right } "+
            t1+'> .smilies {padding:8px;padding-top:0px;border-top:2px outset #989898;} '+
            t1+'> .smilies img {margin:2px 3px;background:transparent;border:none;cursor:hand} '+
            t1+" select { margin:7px 0 0 2px } "+
            'div.fpost '+t1+'>img{width:22px;margin-right:0}  div.fpost '+t1+'{width:100%!important} '+
            (Styles.Styles||'')
    S.type="text/css";
    S.id="OETCSS";
    d.getElementsByTagName("head")[0].appendChild(S)
        
    Where.parentElement.insertBefore(tDiv,Where)
    
    var cst=tDiv.offsetTop+tDiv.offsetHeight+1;
    if(cst<(TxtArea.offsetTop))tDiv.style.marginBottom="-"+ (TxtArea.offsetTop-(cst))+"px";
    
    if(!Styles.NoAutoAdjust){
     var adjust=function(){
      tDiv.style.width=TxtArea.offsetWidth
     }
     var qr;if(qr=d[g]("quickreply"))qr.style.marginBottom=0;
     adjust();
     document.addEventListener('load',adjust,false);
     document.addEventListener('resize',adjust,false);
    }
    
    TxtArea.addEventListener("keypress",
        function(e){
            var key=String.fromCharCode(e.keyCode).toLowerCase()
            if((key in keys)&& e.target.hotKey && !e.ctrlKey){
                ForMat(TxtArea,keys[key].split("-"))
                e.preventDefault()
                e.target.hotKey=0
            }else if(e.keyCode==17){
                e.target.hotKey=!e.target.hotKey
            }else
                e.target.hotKey=0
        }
    ,false);
    
    
    function ForMat(TxtArea,q,elem){
      var value=q[1]||'';q=q[0];
      if (q=="SMILIES"){
          AddSmilies()
          var temp=smDiv.style,temp2=elem.style,hid=temp.display=='none'
          temp.display=hid?'':'none'
          temp2.backgroundColor=hid?"#C6C6C6":""
          temp2.borderStyle=hid?"ridge":""
          //TxtArea.blur();TxtArea.focus();
          return
      };
      var CurPos=TxtArea.selectionStart
      TxtArea.focus()
      var sel=document.selection.createRange(),selTxt=(sel&&sel.text)||'';
      if(q=="SMADD"){
          if (! sel)
           TxtArea.value += value
          else{
           sel.text = value
           sel.collapse(false);
           sel.select();
          }
          return
      }else if(q=='LIST'){
          value=prompt("  1\tfor Numbered list,\n  a\tfor Alphabetical list,\n  \tfor bullet list.",'1')
          if(value==null)return
          selTxt = "\n  [*]"+selTxt.replace(/\n/g, "\n  [*]")+'\n'
      }
      if (q == "IMGLEFT") {
          value = prompt("Enter the URL for the image",'');
          if (value == null)return;
      }else if (q == "IMGRIGHT") {
          value = prompt("Enter the URL for the image",'');
          if (value == null)return;
      }else if (q == "IMG") {
          value = prompt("Enter the URL for the image",'');
          if (value == null)return;
      }else if (q == "URL" || q == "EMAIL") {
          if (!selTxt.length)
              selTxt = prompt("Enter the text to be displayed for the link", "");
          value = prompt("Enter the " + (q == "URL" ? "full URL" : "E-mail") + " for the link", value);
          if (value == null)return;
      }
      if (q != "IMGLEFT" && !sel && !selText) {
          selTxt = prompt("Enter the text to be formatted:", "");
          if (!selTxt)selTxt = "";
      }
    
      if (q != "IMGLEFT" && sel) {
          sel.text = "[" + q + (value ? "=" + value : "") + "]" + selTxt + "[/" + q + "]";
          sel.collapse(false);
          sel.select();
      } else
          TxtArea.value += "[" + q + (value ? "=" + value : "") + "]" + (q != "IMGLEFT" ? selTxt + "[/" + q + "]" : "");

      if(AutoReSelect){
          var strt=CurPos+q.length+2+(value?1+value.length:0)
          TxtArea.setSelectionRange(strt,strt+selTxt.length)
      }
    }
}

document.addEventListener("DOMContentLoaded",function(){
    var codTT;
    if(/\/.*?\/forums\//.test(location.pathname) && (codTT=document.forms.addcomment))
      opera.AddCodeTools(codTT.comment,codTT)
    else if(typeof document.selectSingleNode!="undefined"
		&&(codTT==document.selectSingleNode('//form//textarea[@id="message"]')||codTT==document.selectSingleNode('//form//textarea[@name="comment"]'))){
      var widgetsPage=location.hostname=='widgets.opera.com',selWid=widgetsPage?54:40;
      if(codTT)opera.AddCodeTools(
        codTT,(widgetsPage?codTT:codTT.form),
        {
         Styles:' DIV.OperaEditTools>IMG{margin-right:-.7pt;width:22px} '+
                ' div.OperaEditTools>div.flRight{height:33px;width:'+(selWid*3+3)+'px;overflow:hidden} '+
                ' div.OperaEditTools select{width:'+selWid+'px;margin-left:0} '+
                ' div.OperaEditTools{width:'+(codTT.form||{}).offsetWidth+'px;line-height:0;padding:0!important;'+(widgetsPage?'margin-top:3px':'')+'}',
         NoAutoAdjust:1
        }
      )
    }else if(typeof document.selectSingleNode!="undefined"
		&&codTT==document.selectSingleNode('//form//textarea[@name="message"]'))
      opera.AddCodeTools(codTT,codTT,{Styles:' DIV.OperaEditTools>IMG{margin-right:0px;} div.OperaEditTools>div.flRight{display:none}'})
},false);
})(window.opera||window);