(function(){function e(e){function r(e){function a(e){for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}var t,n=e.shift()
return e.length>0&&(a.prototype=r(e)),t=new a(n)}return r(e.slice(0))}function r(e,r){var a,u,l,d,w,g,y,v=t,x=r[0],O="",_=[[r[0]]],m="function",C="Illegal call : ",P="Syntax error : "
for(a=0;a<e.length;a++)switch(u=_[0],l=e[a],d=l[0],g=l[1],O+=d,g){case n:throw P+O
case s:w=[r[0]],w._=!0,w.c=v,w.cP=x,_.unshift(w),v=t,x=r[0]
break
case o:if(w=_.shift(),y=w.c,!w._)throw P+C+O
if(y===r[0])throw P+C+O
if(typeof y!==m)throw"Type error: "+typeof y+" is not a "+m+" : "+O
_[0][0]=y.apply(w.cP,w.reverse()),v=_[0][0]
break
case c:_.unshift([r[0]]),v=t,x=r[0]
break
case i:if(v=_.shift(),u=_[0],u[0]===r[0])throw P+C+O
if(u[0]===t)throw"Cannot read property '"+d+"' of undefined : "+O
v=u[0][v[0]],u[0]=v
break
case f:x=v,v=t
break
case h:if(v=t,x=r[0],!u._)throw P+O
u[0]===r[0]&&(u[0]=t),u.unshift(r[0])
break
case b:u[0]=v=d
break
case k:u[0]=v=parseFloat(d)
break
case p:if(u[0]===t)throw"Cannot read property '"+d+"' of undefined : "+O
v=u[0][d],u[0]=v}return u=_[0],u===r[0]?t:u[0]}function a(e){var r,a,w,x,O=[],_="",m=n
for(r=0;r<e.length;r++){switch(a=e[r],w=t,x=_.length==1,m){case n:if(w=v[a],w!==t)break
if(l.indexOf(a)+1){w=k
break}g.indexOf(a)+1&&(w=p)
break
case s:("("!=a||x)&&(w=n)
break
case o:(")"!=a||x)&&(w=n)
break
case c:("["!=a||x)&&(w=n)
break
case i:("]"!=a||x)&&(w=n)
break
case f:("."!=a||x)&&(w=n)
break
case h:(","!=a||x)&&(w=n)
break
case u:" "!=a&&(w=n)
break
case b:"'"==a&&(_.length<=1&&"'"!==_||e[r+1]!=="'"?_.length>1&&(_=_.substring(1),a="",w=n):(a="'",r++))
break
case k:d.indexOf(a)<0&&(w=n)
break
case p:y.indexOf(a)<0&&(w=n)}w?(_.length&&O.push([_,m]),m=w,_="",""!==a&&r--):_+=a}return _.length&&O.push([_,m]),O}var t=void 0,n=99,s=3,o=4,c=5,i=6,f=7,h=8,u=9,b=10,k=11,p=12,l="1234567890-",d=l+".",w="abcdefghijklmnopqrstuvwxyz",g=w+w.toUpperCase()+"_$",y=g+l,v={"(":s,")":o,"[":c,"]":i,".":f,",":h," ":u,"'":b}
module.exports=function(n){var s=a(n)
return function(a){a===t&&(a=[{}]),a.constructor.name!=="Array"&&(a=[a])
var n=[e(a)]
return r(s,n)}}})()
