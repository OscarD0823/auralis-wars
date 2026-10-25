// Simulation facing is measured from world +Y. Isometric screen Y is compressed;
// remove that compression before choosing one of the eight compass views.
export function facingView(facing=0,count=5){
 const x=Math.sin(facing)-Math.cos(facing),y=Math.sin(facing)+Math.cos(facing);
 const direction=Math.max(0,Math.min(count-1,Math.round((Math.atan2(y,Math.abs(x))+Math.PI/2)/Math.PI*(count-1))));
 return {direction,mirror:x< -1e-8,x,y:y*.5};
}
export const SHOT_DURATION=.36;
// Cooldown is not an animation clock: only a real shot or heal starts a pose.
export function actorShot(battle,actor){
 if(!battle||actor.hp<=0||actor.dying||actor.moving)return null;
 for(let i=battle.effects.length-1;i>=0;i--){const e=battle.effects[i],age=battle.elapsed-e.at;if(e.actorId===actor.id&&age>=0&&age<SHOT_DURATION)return{age,progress:age/SHOT_DURATION,effect:e};}
 return null;
}
export function shotRecoil(age){return age>=0&&age<SHOT_DURATION?Math.sin(Math.min(1,age/.07)*Math.PI/2)*Math.max(0,1-age/SHOT_DURATION):0;}
export function animationPose(spec,options={}){
 const states=spec.states;
 const state=options.death&&states.death?'death':options.attack&&states.attack?'attack':options.working&&states.gather?'gather':options.carrying&&states.carry?'carry':options.moving&&states.walk?'walk':'idle';
 const directions=states[state]||states.idle||Object.values(states)[0];if(!directions?.length)return null;
 const view=facingView(options.facing||0,directions.length),seq=directions[view.direction],time=Math.max(0,options.time||0);
 let phase;if(state==='death')phase=Math.min(seq.length-1,Math.floor(time*9));
 else if(state==='attack')phase=Math.min(seq.length-1,Math.floor((options.shot?.progress||0)*seq.length));
 else if((state==='walk'||state==='carry')&&options.moving)phase=spec.directional?Math.floor((options.gait??time*1.6)*seq.length)%seq.length:Math.floor(time*9)%seq.length;
 else phase=state==='carry'?0:Math.floor(time*(state==='gather'?4:9))%seq.length;
 return {state,dir:view.direction,mirror:view.mirror,dx:view.x,dy:view.y,offset:phase,n:seq[phase],time};
}
const seedPhase=id=>{let n=0;for(const c of String(id))n=(n*31+c.charCodeAt(0))>>>0;return(n%101)/101;};
// Render-only state. Distance drives footfalls, so slow units do not skate and
// stopping / a blocked path cannot keep playing the walking loop. Never saved.
export class ActorMotion{
 constructor(){this.samples=new Map();}
 sample(actor,time){
  const previous=this.samples.get(actor.id),distance=previous?Math.hypot(actor.x-previous.x,actor.y-previous.y):0;
  const continuous=previous&&time>=previous.time&&distance<2;
  const moving=!!actor.moving&&continuous&&distance>1e-6;
  const gait=(continuous?previous.gait:seedPhase(actor.id))+(moving?distance/1.1:0);
  const facing=moving?Math.atan2(actor.x-previous.x,actor.y-previous.y):actor.facing||0;
  this.samples.set(actor.id,{x:actor.x,y:actor.y,time,gait:gait%1});
  return{moving,gait:gait%1,facing};
 }
 retain(actors){const ids=new Set(actors.map(a=>a.id));for(const id of this.samples.keys())if(!ids.has(id))this.samples.delete(id);}
}
