(function(e){function r(e){function r(e){function t(e){for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}var n,a=e.shift()
return e.length>0&&(t.prototype=r(e)),n=new t(a)}return r(e.slice(0))}function t(e){e=e.trim()
var t=a(e)
return function(e){e===o&&(e=[{}]),e.constructor.name!=="Array"&&(e=[e])
var a=[r(e)]
return n(t,a)}}function n(e,r){var t,n,a,p,l,y,g,v=o,x=r[0],m="",O=[[r[0]]],_="function",j="Illegal call : ",C="Syntax error : "
for(t=0;t<e.length;t++)switch(n=O[0],a=e[t],p=a[0],y=a[1],m+=p,y){case i:throw C+m
case s:l=[r[0]],l._=!0,l.c=v,l.cP=x,O.unshift(l),v=o,x=r[0]
break
case f:if(l=O.shift(),g=l.c,!l._)throw C+j+m
if(g===r[0])throw C+j+m
if(typeof g!==_)throw"Type error: "+typeof g+" is not a "+_+" : "+m
O[0][0]=g.apply(l.cP,l.reverse()),v=O[0][0]
break
case c:O.unshift([r[0]]),v=o,x=r[0]
break
case h:if(v=O.shift(),n=O[0],n[0]===r[0])throw C+j+m
if(n[0]===o)throw"Cannot read property '"+p+"' of undefined : "+m
v=n[0][v[0]],n[0]=v
break
case u:x=v,v=o
break
case b:if(v=o,x=r[0],!n._)throw C+m
n[0]===r[0]&&(n[0]=o),n.unshift(r[0])
break
case k:n[0]=v=p
break
case w:n[0]=v=parseFloat(p)
break
case d:if(n[0]===o)throw"Cannot read property '"+p+"' of undefined : "+m
v=n[0][p],n[0]=v}return n=O[0],n===r[0]?o:n[0]}function a(e){var r,t,n,a,g=[],O="",_=i
if("''"===e)return g.push(["",k]),g
for(r=0;r<e.length;r++){switch(t=e[r],n=o,a=O.length==1,_){case i:if(n=m[t],n!==o)break
if(l.indexOf(t)+1){n=w
break}v.indexOf(t)+1&&(n=d)
break
case s:("("!=t||a)&&(n=i)
break
case f:(")"!=t||a)&&(n=i)
break
case c:("["!=t||a)&&(n=i)
break
case h:("]"!=t||a)&&(n=i)
break
case u:("."!=t||a)&&(n=i)
break
case b:(","!=t||a)&&(n=i)
break
case p:" "!=t&&(n=i)
break
case k:"'"==t&&(O.length<=1&&"'"!==O||e[r-1]!=="\\"?O.length>1&&(O=O.substring(1),t="",n=i):O=O.substring(0,O.length-1))
break
case w:y.indexOf(t)<0&&(n=i)
break
case d:x.indexOf(t)<0&&(n=i)}n?(O.length&&g.push([O,_]),_=n,O="",""!==t&&r--):O+=t}return O.length&&g.push([O,_]),g}var o=void 0,i=99,s=3,f=4,c=5,h=6,u=7,b=8,p=9,k=10,w=11,d=12,l="1234567890-",y=l+".",g="abcdefghijklmnopqrstuvwxyz",v=g+g.toUpperCase()+"_$",x=v+l,m={"(":s,")":f,"[":c,"]":h,".":u,",":b," ":p,"'":k}
"object"==typeof module&&"undefined"==typeof window&&(module.exports=t),"object"==typeof window&&e===window&&(window.funex=t)})(this)
