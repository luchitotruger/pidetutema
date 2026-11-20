// V5.33.3 UX Seleccion Musical
'use strict';
  const APP_VERSION="5.47.0";let pendingSw=null,updateReloading=false,screenUpdateTimer=null;
  function projectionActive(){return Boolean((el.screenDjAd&&!el.screenDjAd.hidden)||(el.screenPartyPhoto&&!el.screenPartyPhoto.hidden)||(el.screenPartyGreeting&&!el.screenPartyGreeting.hidden)||(el.screenKaraoke&&!el.screenKaraoke.hidden)||(el.screenDedication&&!el.screenDedication.hidden))}
  function reloadForUpdate(){
  if(updateReloading)return;

  updateReloading=true;

  if(el.applyAppUpdate){
    el.applyAppUpdate.disabled=true;
    el.applyAppUpdate.textContent='🔄 ACTUALIZANDO...';
  }

  sessionStorage.setItem('ptt-update-reload',APP_VERSION);

  if(pendingSw){
    pendingSw.postMessage({type:'SKIP_WAITING'});

    setTimeout(()=>{
      if(updateReloading){
        location.reload();
      }
    },2500);

    return;
  }

  location.reload();
}
  function showAppUpdate(worker=null){pendingSw=worker||pendingSw;if(el.appUpdateBanner)el.appUpdateBanner.hidden=false;if(screenModeActive){clearTimeout(screenUpdateTimer);const wait=()=>{if(!projectionActive())reloadForUpdate();else screenUpdateTimer=setTimeout(wait,1000)};screenUpdateTimer=setTimeout(wait,1000)}}
  function bindAutoUpdate(){if(el.appVersionLabel)el.appVersionLabel.textContent=`V${APP_VERSION}`;if(!('serviceWorker'in navigator))return;navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(!updateReloading)return;

  sessionStorage.removeItem('ptt-update-reload');
  location.reload();
});window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('/service-worker.js?v='+APP_VERSION,{updateViaCache:'none'});if(reg.waiting)showAppUpdate(reg.waiting);reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showAppUpdate(nw)})});setInterval(()=>reg.update().catch(()=>{}),60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)reg.update().catch(()=>{})});window.addEventListener('online',()=>reg.update().catch(()=>{}))}catch(e){console.warn('PWA update:',e.message)}})}

const cfg=window.APP_CONFIG||{};
const configured=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.SUPABASE_URL||'')&&!String(cfg.SUPABASE_PUBLISHABLE_KEY||'').startsWith('TU_');
const db=configured?supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
  window.__PTT_DB=db;
const $=id=>document.getElementById(id);
const el={guest:$('guest'),dj:$('dj'),djNav:$('djNav'),loginModal:$('loginModal'),loginForm:$('loginForm'),loginEmail:$('loginEmail'),loginPassword:$('loginPassword'),loginButton:$('loginButton'),loginNotice:$('loginNotice'),closeLogin:$('closeLogin'),requestForm:$('requestForm'),title:$('title'),artist:$('artist'),requester:$('requester'),message:$('message'),sendButton:$('sendButton'),notice:$('notice'),ranking:$('ranking'),djList:$('djList'),eventName:$('eventName'),djIdentity:$('djIdentity'),nRequests:$('nRequests'),nVotes:$('nVotes'),nQueue:$('nQueue'),refreshButton:$('refreshButton'),toast:$('toastContainer'),enableNotifications:$('enableNotifications'),toggleSound:$('toggleSound'),djSearch:$('djSearch'),statusFilter:$('statusFilter'),newBadge:$('newBadge'),connectionBar:$('connectionBar'),connectionText:$('connectionText'),nowPlaying:$('nowPlaying'),musicSearch:$('musicSearch'),clearMusicSearch:$('clearMusicSearch'),musicSearchStatus:$('musicSearchStatus'),musicResults:$('musicResults'),manualSongToggle:$('manualSongToggle'),selectedMusic:$('selectedMusic'),manualSongFields:$('manualSongFields'),summaryContent:$('summaryContent'),toggleSummary:$('toggleSummary'),summaryTopSong:$('summaryTopSong'),summaryTopSongMeta:$('summaryTopSongMeta'),summaryTopArtist:$('summaryTopArtist'),summaryTopArtistMeta:$('summaryTopArtistMeta'),summaryPeakHour:$('summaryPeakHour'),summaryPeakHourMeta:$('summaryPeakHourMeta'),summaryTopSongs:$('summaryTopSongs'),summaryStatuses:$('summaryStatuses'),summaryUpdated:$('summaryUpdated'),copySummary:$('copySummary'),mySongsCard:$('mySongsCard'),mySongs:$('mySongs'),mySongsCount:$('mySongsCount'),surpriseButton:$('surpriseButton'),surprisePanel:$('surprisePanel'),closeSurprise:$('closeSurprise'),surpriseCategories:$('surpriseCategories'),surpriseSuggestions:$('surpriseSuggestions'),shuffleSurprise:$('shuffleSurprise'),numberOneCelebration:$('numberOneCelebration'),confettiLayer:$('confettiLayer'),closeNumberOne:$('closeNumberOne'),closeNumberOneAction:$('closeNumberOneAction'),numberOneArtwork:$('numberOneArtwork'),numberOneSong:$('numberOneSong'),numberOneArtist:$('numberOneArtist'),numberOneVotes:$('numberOneVotes'),highlightDedication:$('highlightDedication'),dedicationSpotlight:$('dedicationSpotlight'),closeDedicationSpotlight:$('closeDedicationSpotlight'),closeDedicationAction:$('closeDedicationAction'),dedicationArtwork:$('dedicationArtwork'),dedicationMessage:$('dedicationMessage'),dedicationRequester:$('dedicationRequester'),dedicationArtist:$('dedicationArtist'),clearProjectedDedication:$('clearProjectedDedication'),openScreenMode:$('openScreenMode'),screenMode:$('screenMode'),screenScene:$('screenScene'),screenPrevScene:$('screenPrevScene'),screenNextScene:$('screenNextScene'),screenToggleAuto:$('screenToggleAuto'),screenEventName:$('screenEventName'),screenFullscreen:$('screenFullscreen'),screenExit:$('screenExit'),screenNow:$('screenNow'),screenTop3:$('screenTop3'),screenDedication:$('screenDedication'),screenDedicationArtwork:$('screenDedicationArtwork'),screenDedicationSong:$('screenDedicationSong'),screenDedicationMessage:$('screenDedicationMessage'),screenDedicationRequester:$('screenDedicationRequester'),screenClock:$('screenClock'),eventSelector:$('eventSelector'),newEventButton:$('newEventButton'),newEventForm:$('newEventForm'),newEventName:$('newEventName'),newEventDate:$('newEventDate'),newEventNotice:$('newEventNotice'),cancelNewEvent:$('cancelNewEvent'),copyEventLink:$('copyEventLink'),toggleEventActive:$('toggleEventActive'),eventManagerMeta:$('eventManagerMeta'),showEventQr:$('showEventQr'),eventQrModal:$('eventQrModal'),closeEventQr:$('closeEventQr'),eventQrName:$('eventQrName'),eventQrCanvas:$('eventQrCanvas'),eventQrUrl:$('eventQrUrl'),downloadEventQr:$('downloadEventQr'),copyEventQrLink:$('copyEventQrLink'),screenQr:$('screenQr'),customizeEventButton:$('customizeEventButton'),eventThemeForm:$('eventThemeForm'),closeThemeForm:$('closeThemeForm'),eventDisplayName:$('eventDisplayName'),themeChoices:$('themeChoices'),customColors:$('customColors'),themePrimary:$('themePrimary'),themeSecondary:$('themeSecondary'),themeAccent:$('themeAccent'),themePreview:$('themePreview'),themePreviewName:$('themePreviewName'),resetEventTheme:$('resetEventTheme'),themeNotice:$('themeNotice'),layoutChoices:$('layoutChoices'),layoutPreviewText:$('layoutPreviewText'),refreshAnalytics:$('refreshAnalytics'),analyticsNotice:$('analyticsNotice'),analyticsContent:$('analyticsContent'),aVisitors:$('aVisitors'),aMobile:$('aMobile'),aTablet:$('aTablet'),aDesktop:$('aDesktop'),aPeakHour:$('aPeakHour'),aPeakMeta:$('aPeakMeta'),aFirstSeen:$('aFirstSeen'),aLastSeen:$('aLastSeen'),aDevices:$('aDevices'),aOs:$('aOs'),aBrowsers:$('aBrowsers'),aHours:$('aHours'),analyticsUpdated:$('analyticsUpdated'),eRate:$('eRate'),eRequests:$('eRequests'),eRequesters:$('eRequesters'),eVoters:$('eVoters'),eVotes:$('eVotes'),ePlayed:$('ePlayed'),eFunnel:$('eFunnel'),guestNickname:$('guestNickname'),saveGuestNickname:$('saveGuestNickname'),clearGuestNickname:$('clearGuestNickname'),guestIdentityStatus:$('guestIdentityStatus'),refreshMyActivity:$('refreshMyActivity'),refreshSmartRanking:$('refreshSmartRanking'),smartRankingNotice:$('smartRankingNotice'),smartRanking:$('smartRanking'),refreshGuestGame:$('refreshGuestGame'),guestGameNotice:$('guestGameNotice'),guestGameContent:$('guestGameContent'),gameLevelIcon:$('gameLevelIcon'),gamePoints:$('gamePoints'),gameLevel:$('gameLevel'),gameRequestPoints:$('gameRequestPoints'),gameVotePoints:$('gameVotePoints'),gamePlayedPoints:$('gamePlayedPoints'),gameProgress:$('gameProgress'),gameNextLevel:$('gameNextLevel'),refreshGameLeaderboard:$('refreshGameLeaderboard'),gameLeaderboardNotice:$('gameLeaderboardNotice'),gameLeaderboard:$('gameLeaderboard'),myActivityNotice:$('myActivityNotice'),myActivityContent:$('myActivityContent'),myRequests:$('myRequests'),myVotes:$('myVotes'),myPlayed:$('myPlayed'),mySongs:$('mySongs'),achievementsCard:$('achievementsCard'),achievementCount:$('achievementCount'),achievementProgress:$('achievementProgress'),achievementsList:$('achievementsList'),nextUpCard:$('nextUpCard'),nextUpList:$('nextUpList'),trendsCard:$('trendsCard'),trendsList:$('trendsList'),battleGuestCard:$('battleGuestCard'),battleGuestContent:$('battleGuestContent'),battleTimer:$('battleTimer'),challengeGuestCard:$('challengeGuestCard'),challengeTitle:$('challengeTitle'),challengeProgress:$('challengeProgress'),challengeMeta:$('challengeMeta'),djSurprisePreference:$('djSurprisePreference'),requestDjSurprise:$('requestDjSurprise'),djSurpriseStatus:$('djSurpriseStatus'),refreshLiveControl:$('refreshLiveControl'),battleSongA:$('battleSongA'),battleSongB:$('battleSongB'),battleDuration:$('battleDuration'),startBattle:$('startBattle'),endBattle:$('endBattle'),battleAdminStatus:$('battleAdminStatus'),challengeName:$('challengeName'),challengeType:$('challengeType'),challengeTarget:$('challengeTarget'),startChallenge:$('startChallenge'),endChallenge:$('endChallenge'),challengeAdminStatus:$('challengeAdminStatus'),surpriseAdminList:$('surpriseAdminList'),feedbackSavedBadge:$('feedbackSavedBadge'),feedbackStars:$('feedbackStars'),feedbackRatingText:$('feedbackRatingText'),feedbackTags:$('feedbackTags'),feedbackComment:$('feedbackComment'),submitDjFeedback:$('submitDjFeedback'),feedbackNotice:$('feedbackNotice'),refreshFeedbackDashboard:$('refreshFeedbackDashboard'),feedbackDashboardNotice:$('feedbackDashboardNotice'),feedbackDashboard:$('feedbackDashboard'),feedbackAverage:$('feedbackAverage'),feedbackCount:$('feedbackCount'),feedbackDistribution:$('feedbackDistribution'),feedbackAspects:$('feedbackAspects'),feedbackComments:$('feedbackComments'),myPartyHub:$('myPartyHub'),myPartyHello:$('myPartyHello'),myPartyEvent:$('myPartyEvent'),myPartyLevel:$('myPartyLevel'),hubRequests:$('hubRequests'),hubVotes:$('hubVotes'),hubAchievements:$('hubAchievements'),hubPoints:$('hubPoints'),hubMySong:$('hubMySong'),hubActions:$('hubActions'),liveReactions:$('liveReactions'),reactionSong:$('reactionSong'),reactionButtons:$('reactionButtons'),reactionEnergy:$('reactionEnergy'),reactionFire:$('reactionFire'),reactionLove:$('reactionLove'),reactionDance:$('reactionDance'),reactionWow:$('reactionWow'),reactionNotice:$('reactionNotice'),refreshReactions:$('refreshReactions'),djReactionEnergy:$('djReactionEnergy'),djReactionTotal:$('djReactionTotal'),djReactionEventTotal:$('djReactionEventTotal'),djReactionPeak:$('djReactionPeak'),djReactionBreakdown:$('djReactionBreakdown'),reactionTopSongs:$('reactionTopSongs'),screenReactions:$('screenReactions'),partyNotificationButton:$('partyNotificationButton'),partyNotificationBadge:$('partyNotificationBadge'),partyNotificationDrawer:$('partyNotificationDrawer'),closeNotificationDrawer:$('closeNotificationDrawer'),partyNotificationList:$('partyNotificationList'),markNotificationsRead:$('markNotificationsRead'),achievementCelebration:$('achievementCelebration'),closeAchievementCelebration:$('closeAchievementCelebration'),achievementCelebrationTitle:$('achievementCelebrationTitle'),achievementCelebrationDesc:$('achievementCelebrationDesc'),recommendationsCard:$('recommendationsCard'),recommendationsList:$('recommendationsList'),myNightCard:$('myNightCard'),myNightContent:$('myNightContent'),downloadMyNight:$('downloadMyNight'),shareMyNight:$('shareMyNight'),closeParty:$('closeParty'),mobileBottomNav:$('mobileBottomNav'),mobilePhotoAction:$('mobilePhotoAction'),mobilePhotoBadge:$('mobilePhotoBadge'),mobileContextAction:$('mobileContextAction'),mobileContextIcon:$('mobileContextIcon'),mobileContextLabel:$('mobileContextLabel'),mobileContextBadge:$('mobileContextBadge'),mobileMiniPlayer:$('mobileMiniPlayer'),mobileMiniCover:$('mobileMiniCover'),mobileMiniTitle:$('mobileMiniTitle'),mobileMiniArtist:$('mobileMiniArtist'),contextualSheet:$('contextualSheet'),closeContextualSheet:$('closeContextualSheet'),contextualIcon:$('contextualIcon'),contextualKicker:$('contextualKicker'),contextualTitle:$('contextualTitle'),contextualBody:$('contextualBody'),contextualGo:$('contextualGo'),recentSearchBlock:$('recentSearchBlock'),recentSearches:$('recentSearches'),popularSearchBlock:$('popularSearchBlock'),popularSearches:$('popularSearches'),installPwaButton:$('installPwaButton'),mobileQuickBackdrop:$('mobileQuickBackdrop'),mobileQuickSheet:$('mobileQuickSheet'),mobileQuickClose:$('mobileQuickClose'),mobileQuickKicker:$('mobileQuickKicker'),mobileQuickTitle:$('mobileQuickTitle'),mobileQuickContent:$('mobileQuickContent'),djAnnouncementPanel:$('djAnnouncementPanel'),refreshAnnouncements:$('refreshAnnouncements'),announcementMessage:$('announcementMessage'),announcementPriority:$('announcementPriority'),announcementDuration:$('announcementDuration'),announcementSound:$('announcementSound'),sendAnnouncement:$('sendAnnouncement'),announcementAdminNotice:$('announcementAdminNotice'),announcementTemplates:$('announcementTemplates'),announcementHistory:$('announcementHistory'),announcementOverlay:$('announcementOverlay'),announcementCard:$('announcementCard'),announcementOverlayIcon:$('announcementOverlayIcon'),announcementOverlayKicker:$('announcementOverlayKicker'),announcementOverlayMessage:$('announcementOverlayMessage'),announcementOverlayHint:$('announcementOverlayHint'),ackAnnouncement:$('ackAnnouncement'),partyPushCard:$('partyPushCard'),partyPushState:$('partyPushState'),enablePartyPush:$('enablePartyPush'),disablePartyPush:$('disablePartyPush'),testPartyPush:$('testPartyPush'),repairPartyPush:$('repairPartyPush'),partyPushHealth:$('partyPushHealth'),partyPushNotice:$('partyPushNotice'),iosPushInstructions:$('iosPushInstructions'),showIosPushGuide:$('showIosPushGuide'),iosPushGuide:$('iosPushGuide'),closeIosPushGuide:$('closeIosPushGuide'),closeIosPushGuideAction:$('closeIosPushGuideAction'),socialPartyGuest:$('socialPartyGuest'),socialPartyGuestList:$('socialPartyGuestList'),socialPartyDj:$('socialPartyDj'),refreshSocialParty:$('refreshSocialParty'),socialAdminActive:$('socialAdminActive'),partyPhotoModeration:$('partyPhotoModeration'),partyPhotoPendingCount:$('partyPhotoPendingCount'),partyPhotoQueue:$('partyPhotoQueue'),partyPhotoApproved:$('partyPhotoApproved'),refreshPartyPhotos:$('refreshPartyPhotos'),screenPartyPhoto:$('screenPartyPhoto'),screenPartyPhotoImg:$('screenPartyPhotoImg'),partyPhotoCleanup:$('partyPhotoCleanup'),refreshPartyPhotoStats:$('refreshPartyPhotoStats'),photoStorageTotal:$('photoStorageTotal'),photoStorageBytes:$('photoStorageBytes'),photoStorageRejected:$('photoStorageRejected'),deleteRejectedPhotos:$('deleteRejectedPhotos'),deleteAllEventPhotos:$('deleteAllEventPhotos'),partyPhotoCleanupNotice:$('partyPhotoCleanupNotice'),partyGreetingGuest:$('partyGreetingGuest'),greetingRecipient:$('greetingRecipient'),greetingMessage:$('greetingMessage'),greetingSender:$('greetingSender'),sendPartyGreeting:$('sendPartyGreeting'),greetingGuestNotice:$('greetingGuestNotice'),partyGreetingDj:$('partyGreetingDj'),refreshPartyGreetings:$('refreshPartyGreetings'),partyGreetingPending:$('partyGreetingPending'),partyGreetingApproved:$('partyGreetingApproved'),screenPartyGreeting:$('screenPartyGreeting'),screenGreetingPhoto:$('screenGreetingPhoto'),screenGreetingPhotoImg:$('screenGreetingPhotoImg'),screenGreetingIcon:$('screenGreetingIcon'),screenGreetingType:$('screenGreetingType'),screenGreetingRecipient:$('screenGreetingRecipient'),screenGreetingMessage:$('screenGreetingMessage'),screenGreetingSender:$('screenGreetingSender'),appUpdateBanner:$('appUpdateBanner'),applyAppUpdate:$('applyAppUpdate'),dismissAppUpdate:$('dismissAppUpdate'),appVersionLabel:$('appVersionLabel'),partyGreetingCleanup:$('partyGreetingCleanup'),refreshGreetingStats:$('refreshGreetingStats'),greetingTotal:$('greetingTotal'),greetingPending:$('greetingPending'),greetingApprovedCount:$('greetingApprovedCount'),greetingRejected:$('greetingRejected'),deleteRejectedGreetings:$('deleteRejectedGreetings'),deleteAllGreetings:$('deleteAllGreetings'),greetingCleanupNotice:$('greetingCleanupNotice'),karaokeGuestCard:$('karaokeGuestCard'),karaokeGuestState:$('karaokeGuestState'),karaokeRegistration:$('karaokeRegistration'),karaokeSinger:$('karaokeSinger'),karaokeMusicSearch:$('karaokeMusicSearch'),clearKaraokeMusicSearch:$('clearKaraokeMusicSearch'),karaokeMusicSearchStatus:$('karaokeMusicSearchStatus'),karaokeMusicResults:$('karaokeMusicResults'),karaokeSelectedMusic:$('karaokeSelectedMusic'),karaokeManualToggle:$('karaokeManualToggle'),karaokeManualFields:$('karaokeManualFields'),karaokeSong:$('karaokeSong'),karaokeArtist:$('karaokeArtist'),karaokeProposer:$('karaokeProposer'),karaokeConsentWrap:$('karaokeConsentWrap'),karaokeConsent:$('karaokeConsent'),submitKaraoke:$('submitKaraoke'),karaokeGuestNotice:$('karaokeGuestNotice'),karaokeRating:$('karaokeRating'),karaokeRatingSinger:$('karaokeRatingSinger'),karaokeRatingSong:$('karaokeRatingSong'),karaokeRatingStars:$('karaokeRatingStars'),karaokeRatingClock:$('karaokeRatingClock'),karaokeRatingNotice:$('karaokeRatingNotice'),refreshKaraokeGuest:$('refreshKaraokeGuest'),karaokeGuestRanking:$('karaokeGuestRanking'),karaokeDjCard:$('karaokeDjCard'),refreshKaraokeDj:$('refreshKaraokeDj'),karaokePrize:$('karaokePrize'),karaokeMinVotes:$('karaokeMinVotes'),karaokeRatingSeconds:$('karaokeRatingSeconds'),startKaraoke:$('startKaraoke'),karaokeDjNotice:$('karaokeDjNotice'),karaokeEntries:$('karaokeEntries'),karaokeDjRanking:$('karaokeDjRanking'),projectKaraokeWinner:$('projectKaraokeWinner'),clearKaraokeScreen:$('clearKaraokeScreen'),screenKaraoke:$('screenKaraoke'),screenKaraokeIcon:$('screenKaraokeIcon'),screenKaraokeKicker:$('screenKaraokeKicker'),screenKaraokeSingerLabel:$('screenKaraokeSingerLabel'),screenKaraokeSinger:$('screenKaraokeSinger'),screenKaraokeSong:$('screenKaraokeSong'),screenKaraokeMeta:$('screenKaraokeMeta'),screenKaraokeScore:$('screenKaraokeScore'),karaokeUsage:$('karaokeUsage'),karaokeUsageCount:$('karaokeUsageCount'),karaokeCleanup:$('karaokeCleanup'),refreshKaraokeStats:$('refreshKaraokeStats'),karaokeStatRounds:$('karaokeStatRounds'),karaokeStatEntries:$('karaokeStatEntries'),karaokeStatFinished:$('karaokeStatFinished'),karaokeStatRatings:$('karaokeStatRatings'),deleteFinishedKaraoke:$('deleteFinishedKaraoke'),deleteAllKaraoke:$('deleteAllKaraoke'),karaokeCleanupNotice:$('karaokeCleanupNotice'),publicEventLanding:$('publicEventLanding'),publicEventList:$('publicEventList'),djPublicityPanel:$('djPublicityPanel'),djAdEnabled:$('djAdEnabled'),djAdName:$('djAdName'),djAdHeadline:$('djAdHeadline'),djAdMessage:$('djAdMessage'),djAdWhatsapp:$('djAdWhatsapp'),djAdInstagram:$('djAdInstagram'),djAdTiktok:$('djAdTiktok'),djAdEmail:$('djAdEmail'),djAdCta:$('djAdCta'),djAdFrequency:$('djAdFrequency'),djAdPreview:$('djAdPreview'),saveDjAd:$('saveDjAd'),djAdNotice:$('djAdNotice'),screenDjAd:$('screenDjAd'),screenDjAdHeadline:$('screenDjAdHeadline'),screenDjAdName:$('screenDjAdName'),screenDjAdMessage:$('screenDjAdMessage'),screenDjAdQr:$('screenDjAdQr'),screenDjAdContact:$('screenDjAdContact'),screenDjAdCta:$('screenDjAdCta'),musicDedicationGuest:$('musicDedicationGuest'),dedicationRecipient:$('dedicationRecipient'),dedicationMusicSearch:$('dedicationMusicSearch'),clearDedicationMusicSearch:$('clearDedicationMusicSearch'),dedicationMusicSearchStatus:$('dedicationMusicSearchStatus'),dedicationMusicResults:$('dedicationMusicResults'),dedicationSelectedMusic:$('dedicationSelectedMusic'),dedicationManualToggle:$('dedicationManualToggle'),dedicationManualFields:$('dedicationManualFields'),dedicationSongTitle:$('dedicationSongTitle'),dedicationSongArtist:$('dedicationSongArtist'),dedicationText:$('dedicationText'),dedicationSender:$('dedicationSender'),submitMusicDedication:$('submitMusicDedication'),musicDedicationGuestNotice:$('musicDedicationGuestNotice'),musicDedicationUsage:$('musicDedicationUsage'),myMusicDedications:$('myMusicDedications'),musicDedicationDj:$('musicDedicationDj'),refreshMusicDedications:$('refreshMusicDedications'),musicDedicationKpis:$('musicDedicationKpis'),musicDedicationPending:$('musicDedicationPending'),musicDedicationManaged:$('musicDedicationManaged'),deleteRejectedDedications:$('deleteRejectedDedications'),deleteAllDedications:$('deleteAllDedications'),musicDedicationDjNotice:$('musicDedicationDjNotice'),eventCleanupCenter:$('eventCleanupCenter'),refreshEventCleanup:$('refreshEventCleanup'),eventCleanupTitle:$('eventCleanupTitle'),eventCleanupKpis:$('eventCleanupKpis'),cleanupTotalRows:$('cleanupTotalRows'),cleanupPhotoBytes:$('cleanupPhotoBytes'),cleanupModules:$('cleanupModules'),cleanupAllEvent:$('cleanupAllEvent'),eventCleanupNotice:$('eventCleanupNotice') };
const labels={pending:'Pendiente',accepted:'En lista',next:'Próxima',playing:'Sonando',played:'Reproducida',rejected:'Cerrada'};
let eventId=null,rows=[],session=null,channel=null,soundEnabled=true,unseen=0,initialized=false,selectedMusic=null,musicSearchTimer=null,musicSearchSeq=0,manualSongMode=false,surpriseCategory='fiesta',projectorState={featured_request_id:null},screenModeActive=false,screenClockTimer=null,ownedEvents=[],currentEvent=null,selectedThemeKey='neon',selectedLayoutMode='auto',battleTick=null;
const liveState={battle:null,challenge:null,surprises:[]};
const feedbackState={rating:0,tags:new Set()};
const reactionState={requestId:null,myReaction:null,counts:{fire:0,love:0,dance:0,wow:0},energy:0,eventTotal:0,peak30:0,topSongs:[]};
const finalExperience={notifications:[],partyClosed:false,celebrated:new Set()};
const mobileExperience={sheetKey:null,sheetTarget:null,sheetTimer:null,deferredInstall:null};
const announcementState={active:null,shownId:null,timer:null,reminder:null,audioPrimed:false};
const voterToken=localStorage.getItem('pide_tu_tema_voter')||crypto.randomUUID();localStorage.setItem('pide_tu_tema_voter',voterToken);
// ===== V4.5.2 ANALYTICS SEGURO Y DASHBOARD =====
const visitorToken=localStorage.getItem('pide_tu_tema_visitor')||crypto.randomUUID();localStorage.setItem('pide_tu_tema_visitor',visitorToken);
function visitorDeviceInfo(){const ua=navigator.userAgent||'';const device_type=/iPad|Tablet/i.test(ua)?'tablet':/Mobi|Android|iPhone/i.test(ua)?'mobile':'desktop';const os=/iPhone|iPad|iPod/i.test(ua)?'iOS':/Android/i.test(ua)?'Android':/Windows/i.test(ua)?'Windows':/Mac OS X|Macintosh/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Other';const browser=/Edg\//i.test(ua)?'Edge':/OPR\//i.test(ua)?'Opera':/CriOS|Chrome\//i.test(ua)?'Chrome':/FxiOS|Firefox\//i.test(ua)?'Firefox':/Safari\//i.test(ua)?'Safari':'Other';return{device_type,os,browser}}
async function registerEventVisit(){if(!db||!eventId||session||new URLSearchParams(location.search).get('modo')==='pantalla')return;const x=visitorDeviceInfo();const {error}=await db.rpc('register_event_visit_v452',{p_event_id:eventId,p_visitor_id:visitorToken,p_device_type:x.device_type,p_os:x.os,p_browser:x.browser});if(error)console.warn('Analytics V4.5.2:',error.message)}
function analyticsMap(items){const m=new Map();for(const x of items||[])m.set(String(x.label),Number(x.value)||0);return m}
function analyticsBars(target,items,total){if(!target)return;target.innerHTML=(items||[]).length?items.map(x=>{const n=Number(x.value)||0,p=total?Math.round(n*100/total):0;return `<div class="analytics-bar"><span>${esc(x.label)}</span><span class="analytics-bar-track"><i style="width:${p}%"></i></span><b>${n}</b></div>`}).join(''):'<div class="summary-empty">Sin datos</div>'}
// ===== V5.0.4 GAMIFICACION =====
function gameLevelFor(points){const levels=[{min:0,next:5,icon:'🎧',name:'Calentando motores'},{min:5,next:12,icon:'🎵',name:'Cazador de hits'},{min:12,next:25,icon:'🔥',name:'Animador de la fiesta'},{min:25,next:40,icon:'🕺',name:'Rey de la pista'},{min:40,next:null,icon:'👑',name:'Leyenda de la noche'}];return levels.findLast?levels.findLast(x=>points>=x.min):[...levels].reverse().find(x=>points>=x.min)}
async function loadGuestGame(){if(!db||!eventId||session||!el.guestGameNotice)return;el.guestGameNotice.hidden=false;el.guestGameContent.hidden=true;el.guestGameNotice.textContent='Calculando tus puntos…';const {data,error}=await db.rpc('get_my_game_score_v504',{p_event_id:eventId,p_visitor_id:visitorToken});if(error){el.guestGameNotice.textContent='No se pudo cargar tu puntuación.';console.warn('Gamificación V5.0.4:',error.message);return}const d=data||{},points=Number(d.points)||0,level=gameLevelFor(points);el.gamePoints.textContent=points;el.gameLevelIcon.textContent=level.icon;el.gameLevel.textContent=level.name;el.gameRequestPoints.textContent=`+${Number(d.request_points)||0}`;el.gameVotePoints.textContent=`+${Number(d.vote_points)||0}`;el.gamePlayedPoints.textContent=`+${Number(d.played_points)||0}`;const pct=level.next?Math.max(0,Math.min(100,Math.round((points-level.min)*100/(level.next-level.min)))):100;el.gameProgress.style.width=`${pct}%`;el.gameNextLevel.textContent=level.next?`${level.next-points} puntos para el siguiente nivel`:'🏆 Nivel máximo alcanzado';el.guestGameNotice.hidden=true;el.guestGameContent.hidden=false}
async function loadGameLeaderboard(){if(!session||!eventId||!el.gameLeaderboard)return;el.gameLeaderboardNotice.hidden=false;el.gameLeaderboardNotice.textContent='Calculando posiciones…';const {data,error}=await db.rpc('get_game_leaderboard_v504',{p_event_id:eventId});if(error){el.gameLeaderboardNotice.textContent='No se pudo cargar el ranking de invitados.';console.warn('Gamificación V5.0.4:',error.message);return}const list=data||[],medals=['🥇','🥈','🥉'];el.gameLeaderboardNotice.hidden=!!list.length;el.gameLeaderboardNotice.textContent=list.length?'':'Todavía no hay participantes con puntos.';el.gameLeaderboard.innerHTML=list.map((x,i)=>`<div class="game-player ${x.is_anonymous?'game-anon':''}"><div class="game-player-rank">${medals[i]||i+1}</div><div class="game-player-copy"><b>${esc(x.display_name)}</b><small>🎵 ${Number(x.requests)||0} · ❤️ ${Number(x.votes)||0} · ▶️ ${Number(x.played)||0}</small></div><div class="game-player-points"><b>${Number(x.points)||0}</b><small>pts</small></div></div>`).join('')}
// ===== V5.0.3 RANKING INTELIGENTE =====
function smartMetricLabel(x){const wait=Math.max(0,Math.round(Number(x.wait_minutes)||0)),trend=Number(x.recent_votes)||0;return `<div class="smart-metrics"><span>❤️ ${Number(x.votes)||0}</span><span>⏱ ${wait} min</span>${trend?`<span>🔥 +${trend}</span>`:''}</div>`}
async function loadSmartRanking(){if(!session||!eventId||!el.smartRanking)return;el.smartRankingNotice.hidden=false;el.smartRankingNotice.textContent='Calculando recomendaciones…';el.smartRanking.innerHTML='';const {data,error}=await db.rpc('get_smart_ranking_v503',{p_event_id:eventId});if(error){el.smartRankingNotice.textContent='No se pudo calcular el ranking inteligente.';console.warn('Ranking inteligente V5.0.3:',error.message);return}const list=data||[];el.smartRankingNotice.hidden=!!list.length;el.smartRankingNotice.textContent=list.length?'':'No hay canciones pendientes para recomendar.';el.smartRanking.innerHTML=list.map((x,i)=>`<div class="smart-rank-row"><div class="smart-position">${i===0?'🔥':i+1}</div><div class="smart-song"><strong>${esc(x.title)}</strong><small>${esc(x.artist||'Artista por confirmar')}</small>${smartMetricLabel(x)}</div><div class="smart-score"><b>${Number(x.smart_score).toFixed(1)}</b><small>score</small></div></div>`).join('')}
// ===== V5.0.2 MI ACTIVIDAD =====
function myActivityStatusLabel(status){return status==='played'?'Reproducida':status==='playing'?'Sonando':status==='next'?'Viene pronto':status==='rejected'?'Rechazada':'En espera'}
const achievementDefs=[{icon:'🎵',title:'Primer pedido',desc:'Pide tu primera canción.',test:d=>d.requests>=1},{icon:'🎧',title:'Melómano',desc:'Pide 3 canciones durante la fiesta.',test:d=>d.requests>=3},{icon:'❤️',title:'Primer voto',desc:'Vota por una canción.',test:d=>d.votes>=1},{icon:'🔥',title:'Fan de la pista',desc:'Realiza 10 votos durante la fiesta.',test:d=>d.votes>=10},{icon:'🔊',title:'A la pista',desc:'Una de tus canciones fue reproducida.',test:d=>d.played>=1},{icon:'👑',title:'Rey de la pista',desc:'Una de tus canciones llegó al #1.',test:d=>achievementHasNumberOne()}];
function achievementHasNumberOne(){const prefix=`pide_tu_tema_number_one:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}:`;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(prefix)&&localStorage.getItem(k)==='1')return true}return false}
function renderAchievements(d={}){if(!el.achievementsList)return;const previous=new Set(JSON.parse(localStorage.getItem('pide_tu_tema_achievements:'+eventId)||'[]'));const stats={requests:Number(d.requests)||0,votes:Number(d.votes)||0,played:Number(d.played)||0},items=achievementDefs.map(a=>({...a,unlocked:!!a.test(stats)})),n=items.filter(a=>a.unlocked).length;el.achievementCount.textContent=`${n}/${items.length}`;const bar=el.achievementProgress.querySelector('i');if(bar)bar.style.width=`${Math.round(n*100/items.length)}%`;const unlockedTitles=items.filter(a=>a.unlocked).map(a=>a.title);items.filter(a=>a.unlocked&&!previous.has(a.title)).forEach(showAchievementCelebration);localStorage.setItem('pide_tu_tema_achievements:'+eventId,JSON.stringify(unlockedTitles));el.achievementsList.innerHTML=items.map(a=>`<article class="achievement ${a.unlocked?'unlocked':''}"><span class="achievement-icon">${a.icon}</span><span class="achievement-copy"><b>${esc(a.title)}</b><small>${esc(a.desc)}</small></span><span class="achievement-state">${a.unlocked?'✅':'🔒'}</span></article>`).join('')}
function activeSongs(){return rows.filter(x=>!['playing','played','rejected'].includes(x.status))}
function renderNextUp(){if(!el.nextUpCard)return;const list=activeSongs().slice(0,3);el.nextUpCard.hidden=!list.length;el.nextUpList.innerHTML=list.map((x,i)=>`<div class="next-up-row"><span>${['🥇','🥈','🥉'][i]}</span><span><b>${esc(x.title)}</b><small>${esc(x.artist||'Artista por confirmar')}</small></span><button class="vote" data-next-vote="${x.id}">♥ ${x.votes}</button></div>`).join('')}
function renderTrends(data=[]){if(!el.trendsCard)return;el.trendsCard.hidden=!data.length;el.trendsList.innerHTML=data.map(x=>`<article class="trend-item"><span>${esc(x.label)}</span><b>${esc(x.title)}</b><small>${esc(x.meta)}</small></article>`).join('')}
function updateBattleClock(){const b=liveState.battle;if(!b||b.status!=='active'){clearInterval(battleTick);return}const left=Math.max(0,Math.ceil((new Date(b.ends_at)-Date.now())/1000));el.battleTimer.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;if(!left)loadLiveExperience()}
function renderBattle(){const b=liveState.battle;el.battleGuestCard.hidden=!b;if(!b){clearInterval(battleTick);return}el.battleGuestContent.innerHTML=`<button class="battle-option" data-battle-choice="a"><b>${esc(b.song_a_title)}</b><small>${esc(b.song_a_artist||'')}</small><span>❤️ ${b.votes_a}</span></button><span class="battle-vs">VS</span><button class="battle-option" data-battle-choice="b"><b>${esc(b.song_b_title)}</b><small>${esc(b.song_b_artist||'')}</small><span>❤️ ${b.votes_b}</span></button>`;clearInterval(battleTick);updateBattleClock();battleTick=setInterval(updateBattleClock,1000)}
function renderChallenge(){const c=liveState.challenge;el.challengeGuestCard.hidden=!c;if(!c)return;const pct=Math.min(100,Math.round((Number(c.current_value)||0)*100/Math.max(1,Number(c.target_value)||1)));el.challengeTitle.textContent=c.title;el.challengeProgress.style.width=`${pct}%`;el.challengeMeta.innerHTML=`<span>${c.current_value} / ${c.target_value}</span><strong>${pct}%</strong>`}
function populateBattleSongs(){if(!el.battleSongA)return;const list=activeSongs(),opts=list.map(x=>`<option value="${x.id}">${esc(x.title)} · ${esc(x.artist||'')}</option>`).join('');el.battleSongA.innerHTML=opts;el.battleSongB.innerHTML=opts;if(list[1])el.battleSongB.value=list[1].id}
function renderSurpriseAdmin(){if(!el.surpriseAdminList)return;const list=liveState.surprises||[];el.surpriseAdminList.innerHTML=list.length?list.map(x=>`<div class="surprise-admin-row"><span><b>${esc(x.display_name||'Invitado')}</b><small>${esc(x.preference)} · ${esc(x.status)}</small></span><span class="surprise-admin-actions">${x.status==='pending'?`<button data-surprise-status="accepted" data-surprise-id="${x.id}">✓</button>`:''}<button data-surprise-status="completed" data-surprise-id="${x.id}">🎵</button><button data-surprise-status="rejected" data-surprise-id="${x.id}">×</button></span></div>`).join(''):'<div class="summary-empty">Sin solicitudes pendientes.</div>'}
function notificationKey(){return `pide_tu_tema_notifications:${currentEvent?.slug||eventId||'event'}`}
function readNotifications(){try{return JSON.parse(localStorage.getItem(notificationKey())||'[]')}catch{return[]}}
function writeNotifications(list){localStorage.setItem(notificationKey(),JSON.stringify(list.slice(-50)))}
function addPartyNotification(type,title,body){const list=readNotifications(),key=`${type}:${title}:${body}`;if(list.some(x=>x.key===key))return;list.push({key,type,title,body,createdAt:Date.now(),read:false});writeNotifications(list);renderNotificationCenter();refreshPushState()}
function renderNotificationCenter(){const list=readNotifications().sort((a,b)=>b.createdAt-a.createdAt),unread=list.filter(x=>!x.read).length;el.partyNotificationBadge.hidden=!unread;el.partyNotificationBadge.textContent=unread>9?'9+':unread;updateMobileBottomNav();el.partyNotificationList.innerHTML=list.length?list.map(x=>`<article class="notification-item ${x.read?'':'unread'}"><span>${({next:'🔥',playing:'🔊',numberOne:'👑',achievement:'🏅',battle:'⚔️',challenge:'⚡',surprise:'🎁'})[x.type]||'🔔'}</span><div><b>${esc(x.title)}</b><small>${esc(x.body)}</small></div></article>`).join(''):'<div class="summary-empty">No tienes avisos todavía.</div>'}
function showAchievementCelebration(item){if(!item||finalExperience.celebrated.has(item.title))return;finalExperience.celebrated.add(item.title);el.achievementCelebrationTitle.textContent=item.title;el.achievementCelebrationDesc.textContent=item.desc;el.achievementCelebration.hidden=false;haptic('achievement');addPartyNotification('achievement','Nuevo logro',item.title)}
function renderRecommendations(){if(!el.recommendationsCard)return;const ids=new Set(getMySongIds()),mine=rows.filter(x=>ids.has(x.id)),artists=[...new Set(mine.map(x=>x.artist).filter(Boolean))],candidates=rows.filter(x=>!ids.has(x.id)&&x.status!=='rejected'&&(artists.includes(x.artist)||x.votes>=3)).slice(0,4);el.recommendationsCard.hidden=!candidates.length;el.recommendationsList.innerHTML=candidates.map(x=>`<div class="recommendation-row"><span><b>${esc(x.title)}</b><small>${esc(x.artist||'Artista por confirmar')} · ♥ ${x.votes}</small></span><button data-recommend-vote="${x.id}">❤️ Votar</button></div>`).join('')}
function myNightData(){const a=window.__lastMyActivity||{},mine=rows.filter(x=>getMySongIds().includes(x.id)),best=[...mine].sort((x,y)=>y.votes-x.votes)[0];return{requests:Number(a.requests)||0,votes:Number(a.votes)||0,played:Number(a.played)||0,reactions:reactionState.eventTotal||0,achievements:Number((el.hubAchievements?.textContent||'0').split('/')[0])||0,numberOne:achievementHasNumberOne()?1:0,battles:0,best}}
function renderMyNight(){if(!el.myNightCard)return;const d=myNightData();el.myNightCard.hidden=!finalExperience.partyClosed;el.myNightContent.innerHTML=`<div class="my-night-kpis"><article><b>${d.requests}</b><small>🎵 Pedidas</small></article><article><b>${d.votes}</b><small>❤️ Votos</small></article><article><b>${d.reactions}</b><small>🔥 Reacciones</small></article><article><b>${d.played}</b><small>🔊 Reproducidas</small></article><article><b>${d.achievements}</b><small>🏅 Logros</small></article><article><b>${d.numberOne}</b><small>👑 Número 1</small></article></div>${d.best?`<div class="my-night-song"><small>MI CANCIÓN DE LA NOCHE</small><h3>${esc(d.best.title)}</h3><span>${esc(d.best.artist||'Artista por confirmar')} · ♥ ${d.best.votes}</span></div>`:''}`}
function myNightCanvas(){const d=myNightData(),c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d'),t=themeForEvent();x.fillStyle='#090414';x.fillRect(0,0,c.width,c.height);const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,t.primary);g.addColorStop(.55,t.secondary);g.addColorStop(1,t.accent);x.globalAlpha=.25;x.fillStyle=g;x.fillRect(0,0,1080,1350);x.globalAlpha=1;x.fillStyle='#fff';x.textAlign='center';x.font='900 76px sans-serif';x.fillText('🎉 MI NOCHE',540,130);x.font='700 42px sans-serif';x.fillText(t.displayName,540,195);x.font='800 54px sans-serif';[['🎵',d.requests,'canciones'],['❤️',d.votes,'votos'],['🔥',d.reactions,'reacciones'],['🏅',d.achievements,'logros'],['👑',d.numberOne,'número 1']].forEach((v,i)=>{const yy=330+i*125;x.fillText(`${v[0]}  ${v[1]}  ${v[2]}`,540,yy)});if(d.best){x.font='600 30px sans-serif';x.fillText('MI CANCIÓN DE LA NOCHE',540,1010);x.font='900 58px sans-serif';x.fillText(d.best.title.substring(0,28),540,1085);x.font='600 38px sans-serif';x.fillText((d.best.artist||'').substring(0,35),540,1140)}x.font='800 34px sans-serif';x.fillText('🎧 PIDE TU TEMA · LUIS DJ',540,1260);return c}
async function shareMyNightCard(){const c=myNightCanvas(),blob=await new Promise(r=>c.toBlob(r,'image/png'));const file=new File([blob],`mi-noche-${currentEvent?.slug||'evento'}.png`,{type:'image/png'});if(navigator.share&&navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'Mi Noche'});else{const a=document.createElement('a');a.download=file.name;a.href=URL.createObjectURL(blob);a.click()}}
async function loadPartyFinalState(){if(!db||!eventId)return;const {data,error}=await db.rpc('get_party_state_v515',{p_event_id:eventId});if(error)return;finalExperience.partyClosed=!!data?.is_closed;if(finalExperience.partyClosed){el.requestForm.querySelectorAll('input,button,select,textarea').forEach(x=>x.disabled=true);renderMyNight()}renderRecommendations()}
const HAPTIC_PATTERNS={vote:20,reaction:60,next:100,playing:[100,50,150],achievement:[50,50,100],numberOne:[100,60,100,60,180]};
function vibrateParty(pattern){try{if('vibrate'in navigator)navigator.vibrate(pattern)}catch{}}
function haptic(type){vibrateParty(HAPTIC_PATTERNS[type]||30)}
function reactionEmoji(x){return({fire:'🔥',love:'❤️',dance:'🕺',wow:'🙌'})[x]||'🔥'}
function renderReactions(){if(!el.liveReactions)return;const playing=rows.find(x=>x.status==='playing');el.liveReactions.hidden=!playing;if(!playing){if(el.screenReactions)el.screenReactions.hidden=true;return}el.reactionSong.textContent=`${playing.title}${playing.artist?' · '+playing.artist:''}`;el.reactionEnergy.textContent=`🔥 ${reactionState.energy}%`;const map={fire:el.reactionFire,love:el.reactionLove,dance:el.reactionDance,wow:el.reactionWow};Object.entries(map).forEach(([k,n])=>{if(n)n.textContent=reactionState.counts[k]||0});el.reactionButtons.querySelectorAll('[data-reaction]').forEach(b=>b.classList.toggle('active',b.dataset.reaction===reactionState.myReaction));if(el.screenReactions){el.screenReactions.hidden=false;el.screenReactions.innerHTML=['fire','love','dance','wow'].map(k=>`<span>${reactionEmoji(k)} ${reactionState.counts[k]||0}</span>`).join('')}}
function renderReactionDashboard(){if(!el.djReactionEnergy)return;el.djReactionEnergy.textContent=`${reactionState.energy}%`;el.djReactionTotal.textContent=Object.values(reactionState.counts).reduce((a,b)=>a+Number(b||0),0);el.djReactionEventTotal.textContent=reactionState.eventTotal||0;el.djReactionPeak.textContent=reactionState.peak30||0;el.djReactionBreakdown.innerHTML=['fire','love','dance','wow'].map(k=>`<div>${reactionEmoji(k)} <b>${reactionState.counts[k]||0}</b></div>`).join('');el.reactionTopSongs.innerHTML=(reactionState.topSongs||[]).map((x,i)=>`<div class="reaction-top-row"><span>${i+1}</span><span><b>${esc(x.title)}</b><small>${esc(x.artist||'')}</small></span><strong>🔥 ${x.total}</strong></div>`).join('')}
async function loadReactions(){if(!db||!eventId)return;const playing=rows.find(x=>x.status==='playing');if(!playing){reactionState.requestId=null;renderReactions();renderReactionDashboard();return}const {data,error}=await db.rpc('get_reactions_v59',{p_event_id:eventId,p_request_id:playing.id,p_visitor_id:visitorToken});if(error){console.warn('Reacciones V5.9:',error.message);return}const d=data||{};reactionState.requestId=playing.id;reactionState.myReaction=d.my_reaction||null;reactionState.counts=d.counts||{fire:0,love:0,dance:0,wow:0};reactionState.energy=Number(d.energy)||0;reactionState.eventTotal=Number(d.event_total)||0;reactionState.peak30=Number(d.peak_30)||0;reactionState.topSongs=d.top_songs||[];renderReactions();renderReactionDashboard();refreshMyPartyHub()}
async function sendReaction(kind){if(!reactionState.requestId)return;const first=!reactionState.myReaction;const {error}=await db.rpc('react_song_v59',{p_event_id:eventId,p_request_id:reactionState.requestId,p_visitor_id:visitorToken,p_reaction:kind});if(error){el.reactionNotice.textContent=error.message;return}reactionState.myReaction=kind;haptic('reaction');el.reactionNotice.textContent=`Tu reacción: ${reactionEmoji(kind)}`;if(first)try{await trackEngagement('reaction',reactionState.requestId)}catch{}await loadReactions()}
function recentSearchKey(){return `pide_tu_tema_recent_searches:${currentEvent?.slug||eventId||'event'}`}
function saveRecentSearch(title,artist){const item={title,artist},list=JSON.parse(localStorage.getItem(recentSearchKey())||'[]').filter(x=>`${x.title}|${x.artist}`!==`${title}|${artist}`);list.unshift(item);localStorage.setItem(recentSearchKey(),JSON.stringify(list.slice(0,6)));renderQuickMusicStart()}
function renderQuickMusicStart(){if(!el.recentSearches)return;let recent=[];try{recent=JSON.parse(localStorage.getItem(recentSearchKey())||'[]')}catch{}el.recentSearchBlock.hidden=!recent.length;el.recentSearches.innerHTML=recent.map((x,i)=>`<button type="button" data-quick-recent="${i}">${esc(x.title)} · ${esc(x.artist||'')}</button>`).join('');const popular=rows.filter(x=>!['played','rejected'].includes(x.status)).slice(0,6);el.popularSearchBlock.hidden=!popular.length;el.popularSearches.innerHTML=popular.map(x=>`<button type="button" data-quick-song="${x.id}">${esc(x.title)} · ${esc(x.artist||'')}</button>`).join('')}
function contextualCandidate(){const ids=new Set(getMySongIds()),mine=rows.filter(x=>ids.has(x.id)&&x.status!=='rejected'),myPlaying=mine.find(x=>x.status==='playing'),myNext=mine.find(x=>x.status==='next');if(myPlaying)return{key:`playing:${myPlaying.id}`,icon:'🔊',kicker:'TU CANCIÓN',title:'¡Está sonando!',body:`${myPlaying.title} · ${myPlaying.artist||''}`,target:'liveReactions',h:'playing',ms:8000};if(myNext)return{key:`next:${myNext.id}`,icon:'🔥',kicker:'PREPÁRATE',title:'Tu canción viene pronto',body:`${myNext.title} · ${myNext.artist||''}`,target:'myPartyHub',h:'next',ms:7000};if(liveState.battle)return{key:`battle:${liveState.battle.id}`,icon:'⚔️',kicker:'BATALLA ACTIVA',title:'Elige tu favorita',body:`${liveState.battle.song_a_title} VS ${liveState.battle.song_b_title}`,target:'battleGuestCard',h:'reaction',ms:5500};if(liveState.challenge)return{key:`challenge:${liveState.challenge.id}`,icon:'⚡',kicker:'NUEVO RETO',title:liveState.challenge.title||'Reto de la fiesta',body:`${liveState.challenge.current_value||0} / ${liveState.challenge.target_value||0}`,target:'challengeGuestCard',h:'reaction',ms:5000};return null}
function closeContextualSheet(){clearTimeout(mobileExperience.sheetTimer);el.contextualSheet.hidden=true}
function updateContextualSheet(){if(!el.contextualSheet||session)return;const c=contextualCandidate();if(!c)return closeContextualSheet();if(c.key===mobileExperience.sheetKey)return;mobileExperience.sheetKey=c.key;mobileExperience.sheetTarget=c.target;el.contextualIcon.textContent=c.icon;el.contextualKicker.textContent=c.kicker;el.contextualTitle.textContent=c.title;el.contextualBody.textContent=c.body;el.contextualSheet.hidden=false;haptic(c.h);clearTimeout(mobileExperience.sheetTimer);mobileExperience.sheetTimer=setTimeout(closeContextualSheet,c.ms)}
function setNetworkState(kind){el.connectionBar.classList.toggle('offline',kind==='offline');el.connectionBar.classList.toggle('reconnecting',kind==='reconnecting');if(kind==='offline'){el.connectionText.textContent='Sin conexión';document.body.classList.add('offline-stale')}else if(kind==='reconnecting'){el.connectionText.textContent='Reconectando…'}else{el.connectionText.textContent='Conectado en vivo';document.body.classList.remove('offline-stale')}}
async function recoverNetwork(){setNetworkState('reconnecting');try{await refreshRows();await loadMyActivity();await loadLiveExperience();setNetworkState('online')}catch{setNetworkState('offline')}}
function isAppleMobile(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function isStandaloneWebApp(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
function openIosPushGuide(){el.iosPushGuide.hidden=false;document.body.style.overflow='hidden'}
function closeIosPushGuide(){el.iosPushGuide.hidden=true;document.body.style.overflow=''}
function renderPushPlatformUx(){if(!el.partyPushCard||session)return;const apple=isAppleMobile(),standalone=isStandaloneWebApp(),permission='Notification'in window?Notification.permission:'unsupported';el.partyPushState.classList.remove('needs-install','blocked');el.iosPushInstructions.hidden=true;el.showIosPushGuide.hidden=true;if(apple&&!standalone){el.partyPushState.textContent='INSTALAR';el.partyPushState.classList.add('needs-install');el.iosPushInstructions.hidden=false;el.showIosPushGuide.hidden=false;el.enablePartyPush.hidden=true;el.disablePartyPush.hidden=true;el.partyPushNotice.textContent='En iPhone, primero añade Pide Tu Tema a la pantalla de inicio.';return}if(permission==='denied'){el.partyPushState.textContent='BLOQUEADO';el.partyPushState.classList.add('blocked');el.enablePartyPush.hidden=true;el.disablePartyPush.hidden=true;el.partyPushNotice.textContent=apple?'Activa Pide Tu Tema en Ajustes → Notificaciones.':'Activa las notificaciones desde la configuración del navegador.';return}refreshPushState()}
function urlBase64ToUint8Array(base64String){const padding='='.repeat((4-base64String.length%4)%4),base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/'),raw=atob(base64);return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))}
async function getPushRegistration(){if(!('serviceWorker'in navigator))throw new Error('Este navegador no admite Service Worker.');return navigator.serviceWorker.ready}
async function getPushSubscription(){const reg=await getPushRegistration();return reg.pushManager.getSubscription()}
function paintPushState(active,text=''){if(!el.partyPushState)return;el.partyPushState.classList.toggle('active',active);el.partyPushState.textContent=active?'ACTIVO':'INACTIVO';el.enablePartyPush.hidden=active;el.disablePartyPush.hidden=!active;if(text)el.partyPushNotice.textContent=text}
async function savePushSubscription(sub){const raw=sub.toJSON(),{error}=await db.rpc('sync_push_subscription_v5446',{p_event_id:eventId,p_visitor_id:visitorToken,p_endpoint:raw.endpoint,p_p256dh:raw.keys?.p256dh,p_auth:raw.keys?.auth,p_user_agent:navigator.userAgent});if(error)throw error;await storePushRepairContext(sub)}
function openPushRepairDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open('pide-tu-tema-push',1);r.onupgradeneeded=()=>r.result.createObjectStore('meta');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function storePushRepairContext(sub){try{const raw=sub.toJSON(),database=await openPushRepairDb(),tx=database.transaction('meta','readwrite');tx.objectStore('meta').put({event_id:eventId,visitor_id:visitorToken,supabase_url:cfg.SUPABASE_URL,supabase_key:cfg.SUPABASE_PUBLISHABLE_KEY,vapid_public_key:cfg.VAPID_PUBLIC_KEY,endpoint:raw.endpoint},'context');await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=()=>j(tx.error)});database.close()}catch(e){console.warn('Push repair context:',e.message)}}
function paintPushHealth(kind,text){if(!el.partyPushHealth)return;el.partyPushHealth.className=`push-health ${kind}`;el.partyPushHealth.textContent=text}
async function pushHealthCheck(sync=true){if(!el.partyPushState||session)return false;try{if(!('Notification'in window)||Notification.permission!=='granted'){paintPushState(false);paintPushHealth(Notification.permission==='denied'?'error':'idle',Notification.permission==='denied'?'🔴 Permiso bloqueado':'⚪ Permiso pendiente');return false}const reg=await getPushRegistration(),sub=await reg.pushManager.getSubscription();if(!sub){paintPushState(false);paintPushHealth('warning','🟡 Permiso activo · dispositivo sin registrar');return false}if(sync)await savePushSubscription(sub);paintPushState(true,'✅ Permiso habilitado · dispositivo registrado.');paintPushHealth('ok','🟢 Push operativo');return true}catch(e){paintPushState(false,e.message);paintPushHealth('error','🔴 Push necesita reparación');return false}}
async function enablePartyPush(){try{if(isAppleMobile()&&!isStandaloneWebApp()){openIosPushGuide();throw new Error('En iPhone, abre Pide Tu Tema desde el icono de la pantalla de inicio.')}if(!('Notification'in window)||!('PushManager'in window))throw new Error('Este navegador no admite Web Push.');const key=cfg.VAPID_PUBLIC_KEY;if(!key||String(key).startsWith('TU_'))throw new Error('Falta VAPID_PUBLIC_KEY en config.js.');const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('Permiso de notificaciones no concedido.');const reg=await getPushRegistration();let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key)});await savePushSubscription(sub);await pushHealthCheck(false);toast('🔔 Avisos activados','Recibirás los mensajes importantes del DJ','success')}catch(e){paintPushState(false,e.message||'No se pudieron activar los avisos.');paintPushHealth('error','🔴 Push no operativo');toast('No se activaron los avisos',e.message||'','error')}}
async function disablePartyPush(){try{const sub=await getPushSubscription();await db.rpc('disable_visitor_push_v5446',{p_event_id:eventId,p_visitor_id:visitorToken});if(sub)await sub.unsubscribe();paintPushState(false,'Avisos Push desactivados.');paintPushHealth('idle','⚪ Push desactivado')}catch(e){el.partyPushNotice.textContent=e.message}}
async function refreshPushState(){if(!el.partyPushState||session)return;await pushHealthCheck(true)}
async function repairPartyPush(){if(!eventId)return;el.repairPartyPush.disabled=true;el.testPartyPush.disabled=true;el.partyPushNotice.textContent='Reparando registro Push…';paintPushHealth('warning','🟡 Reparando avisos');try{if(Notification.permission==='denied')throw new Error('Las notificaciones están bloqueadas. Habilítalas en la configuración del navegador.');if(Notification.permission!=='granted'){const p=await Notification.requestPermission();if(p!=='granted')throw new Error('Permiso de notificaciones no concedido.')}const reg=await getPushRegistration(),old=await reg.pushManager.getSubscription();await db.rpc('disable_visitor_push_v5446',{p_event_id:eventId,p_visitor_id:visitorToken});if(old)await old.unsubscribe();const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(cfg.VAPID_PUBLIC_KEY)});await savePushSubscription(sub);await pushHealthCheck(false);toast('🔧 Avisos reparados','Nueva suscripción registrada','success')}catch(e){paintPushHealth('error','🔴 Reparación pendiente');el.partyPushNotice.textContent=e.message;toast('No se pudo reparar',e.message,'error')}finally{el.repairPartyPush.disabled=false;el.testPartyPush.disabled=false}}
async function testPartyPush(){
  el.testPartyPush.disabled=true;
  el.partyPushNotice.textContent='Enviando prueba a este dispositivo…';

  try{
    const ready=await pushHealthCheck(true);

    if(!ready){
      throw new Error('Primero activa o repara los avisos.');
    }

    const sub=await getPushSubscription();

    if(!sub){
      throw new Error(
        'No existe una suscripción Push activa. Pulsa Reparar avisos.'
      );
    }

    const {data,error}=await db.functions.invoke(
      'send-event-push',
      {
        body:{
          event_id:eventId,
          message:'¡Perfecto! Recibirás los avisos de esta fiesta 🎉',
          priority:'important',
          duration_seconds:10,
          sound_enabled:true,
          target_visitor_id:visitorToken,
          test_endpoint:sub.endpoint,
          notification_type:'push_test',
          title:'✅ Pide Tu Tema'
        }
      }
    );

    if(error||!data?.ok){
      throw new Error(
        data?.error ||
        error?.message ||
        'No se pudo enviar la prueba'
      );
    }

    if(!data.sent){
      throw new Error(
        'La prueba no pudo entregarse. Pulsa Reparar avisos.'
      );
    }

    el.partyPushNotice.textContent=
      '✅ Prueba enviada. Revisa la notificación del teléfono.';

    paintPushHealth(
      'ok',
      '🟢 Push operativo'
    );

    toast(
      '📲 Push de prueba enviado',
      'Solo a este dispositivo',
      'success'
    );

  }catch(e){

    paintPushHealth(
      'error',
      '🔴 Prueba no confirmada'
    );

    el.partyPushNotice.textContent=e.message;

    toast(
      'Prueba no enviada',
      e.message,
      'error'
    );

  }finally{
    el.testPartyPush.disabled=false;
  }
}
const announcementTemplates=[['💍','En 5 minutos comienza el vals de los novios'],['🎂','¡Nos preparamos para cantar Cumpleaños Feliz!'],['🎁','Comienza la apertura de regalos'],['💐','Solteras a la pista: lanzamiento del ramo'],['🥂','Prepárense para el brindis'],['📸','Todos atentos para la fotografía grupal'],['🏆','¡Atención! Comienza el concurso'],['💃','¡Todos a la pista!'],['🍽️','Cena / comida disponible'],['🎉','Tenemos una sorpresa']];
function announcementPattern(priority){return priority==='urgent'?[500,150,500,150,700]:priority==='important'?[300,120,300,120,300]:[200,100,200]}
function announcementIcon(priority){return priority==='urgent'?'🚨':priority==='important'?'⚠️':'📣'}
function playAnnouncementTone(priority){if(!announcementState.audioPrimed)return;try{const A=window.AudioContext||window.webkitAudioContext,ctx=new A(),times=priority==='urgent'?[0,.32,.68]:priority==='important'?[0,.26,.52]:[0,.28];times.forEach((t,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=priority==='urgent'?740+(i*90):880+(i*70);g.gain.setValueAtTime(.0001,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(.14,ctx.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+t+.22);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.24)});setTimeout(()=>ctx.close(),1800)}catch{}}
function primeAnnouncementAudio(){announcementState.audioPrimed=true;document.removeEventListener('pointerdown',primeAnnouncementAudio);document.removeEventListener('keydown',primeAnnouncementAudio)}
document.addEventListener('pointerdown',primeAnnouncementAudio,{once:true});document.addEventListener('keydown',primeAnnouncementAudio,{once:true});
function renderAnnouncementTemplates(){if(!el.announcementTemplates)return;el.announcementTemplates.innerHTML=announcementTemplates.map((x,i)=>`<button class="announcement-template" type="button" data-announcement-template="${i}">${x[0]} ${esc(x[1])}</button>`).join('')}
const SOCIAL_LABELS={tables:'👫 Mesa',roulette:'🎲 Ruleta',genres:'🎸 Géneros',dance:'🕺 Baile',mood:'💡 Qué pide la fiesta',guess:'🔮 Adivina',photo:'📸 Foto'};
let socialState={rounds:[],stats:[]};
let partyPhotoState={pending:[],approved:[],selected:null,projectTimer:null};
function socialOptions(r){if(r.kind==='genres'||r.kind==='mood'||r.kind==='guess')return r.config?.options||['Cumbia','Reggaetón','Retro','Para cantar'];if(r.kind==='roulette')return r.config?.options||['💃 Baila','❤️ Dedica un tema','🎤 Canta el coro','🔥 Vota por 3 canciones','📸 Sácate una foto','🎁 Sorpresa DJ'];return[]}
function renderSocialGuest(){if(!el.socialPartyGuest)return;el.socialPartyGuest.hidden=!socialState.rounds.length;el.socialPartyGuestList.innerHTML=socialState.rounds.map(r=>{const opts=socialOptions(r);if(r.kind==='tables')return `<article class="social-round"><h3>${SOCIAL_LABELS[r.kind]} · ${esc(r.title)}</h3><p>Representa a tu mesa con una canción.</p><div class="social-table-form"><input data-social-table placeholder="Mesa / grupo"><input data-social-song placeholder="Canción representante"></div><button class="primary" data-social-submit="${r.id}" data-social-kind="tables">REPRESENTAR MI MESA</button></article>`;if(r.kind==='dance')return `<article class="social-round"><h3>${SOCIAL_LABELS[r.kind]} · ${esc(r.title)}</h3><p>¿Te sumas?</p><div class="social-options"><button data-social-entry="join" data-social-round="${r.id}">🙋 YO PARTICIPO</button></div></article>`;if(r.kind==='photo')return `<article class="social-round"><h3>${SOCIAL_LABELS[r.kind]} · ${esc(r.title)}</h3><p>Toma o elige una foto. Máximo 5 MB. El DJ debe aprobarla antes de proyectarla.</p><div class="party-photo-upload"><input type="file" accept="image/*" data-party-photo-input="${r.id}"><label class="party-photo-picker" data-party-photo-pick="${r.id}"><span>📸</span><b>Tomar / elegir foto</b><small>JPG, PNG o WebP · máximo 5 MB</small></label><div class="interaction-status" data-party-photo-status="${r.id}"></div></div></article>`;return `<article class="social-round"><h3>${SOCIAL_LABELS[r.kind]} · ${esc(r.title)}</h3><div class="social-options">${opts.map((o,i)=>`<button data-social-entry="${esc(String(o))}" data-social-round="${r.id}">${esc(String(o))}</button>`).join('')}</div></article>`}).join('')}
function renderSocialAdmin(){if(!el.socialAdminActive)return;el.socialAdminActive.innerHTML=socialState.rounds.length?socialState.rounds.map(r=>{const total=socialState.stats.filter(x=>x.round_id===r.id).reduce((a,x)=>a+Number(x.value||0),0);return `<div class="social-admin-row"><span><b>${SOCIAL_LABELS[r.kind]} · ${esc(r.title)}</b><small>${total} participaciones</small></span><button class="tool-button" data-social-close="${r.id}">Cerrar</button></div>`}).join(''):'<div class="summary-empty">No hay experiencias sociales activas.</div>'}
async function loadSocialExperience(){if(!db||!eventId)return;const {data,error}=await db.rpc('get_social_experience_v530',{p_event_id:eventId,p_visitor_id:visitorToken});if(error){console.warn('Social V5.30:',error.message);return}socialState=data||{rounds:[],stats:[]};renderSocialGuest();renderSocialAdmin();refreshMyPartyHub();if(session){await loadPartyPhotos();await loadPartyGreetings()}}
async function submitSocialEntry(roundId,key,payload={}){const {error}=await db.rpc('submit_social_entry_v530',{p_round_id:roundId,p_visitor_id:visitorToken,p_entry_key:key,p_display_name:getGuestNickname()||null,p_payload:payload});if(error){toast('No se pudo participar',error.message,'error');return}haptic('reaction');toast('🎉 Participación registrada','¡Gracias por jugar!','success');await loadSocialExperience()}
async function startSocialRound(kind){let title='Experiencia de la fiesta',config={};const map={tables:'socialTablesTitle',roulette:'socialRouletteTitle',genres:'socialGenresTitle',dance:'socialDanceTitle',mood:'socialMoodTitle',guess:'socialGuessTitle',photo:'socialPhotoTitle'};const input=$(map[kind]);if(input?.value.trim())title=input.value.trim();if(kind==='genres'){config.options=($('socialGenresOptions')?.value||'').split(',').map(x=>x.trim()).filter(Boolean)}if(kind==='guess'){config.options=($('socialGuessOptions')?.value||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,4)}if(kind==='mood')config.options=['Más bailable','Cumbia','Reggaetón','Retro','Para cantar','Rock/Pop'];const {error}=await db.rpc('start_social_round_v530',{p_event_id:eventId,p_kind:kind,p_title:title,p_config:config});if(error){toast('No se pudo abrir',error.message,'error');return}toast('🎮 Experiencia activada',title,'success');await loadSocialExperience()}
function formatPhotoBytes(n){const x=Number(n)||0;if(x<1024)return `${x} B`;if(x<1024*1024)return `${(x/1024).toFixed(1)} KB`;return `${(x/1024/1024).toFixed(1)} MB`}
async function invokePhotoManager(action,photoId=null){const {data:sd,error:se}=await db.auth.getSession(),token=sd?.session?.access_token;if(se||!token)throw new Error('Sesion DJ no disponible');const {data,error}=await db.functions.invoke('manage-party-photos',{headers:{Authorization:`Bearer ${token}`},body:{action,event_id:eventId,photo_id:photoId}});if(error||!data?.ok)throw new Error(data?.error||error?.message||'Error gestionando fotografias');return data}
async function loadPartyPhotoStats(){if(!session||!eventId||!el.partyPhotoCleanup)return;try{const d=await invokePhotoManager('stats'),s=d.stats||{};el.photoStorageTotal.textContent=Number(s.total)||0;el.photoStorageBytes.textContent=formatPhotoBytes(s.bytes);el.photoStorageRejected.textContent=Number(s.rejected)||0;el.deleteRejectedPhotos.disabled=!(Number(s.rejected)>0);el.deleteAllEventPhotos.disabled=!(Number(s.total)>0)}catch(e){el.partyPhotoCleanupNotice.textContent=e.message}}
async function deletePartyPhotos(action,photoId=null){const label=action==='delete_one'?'esta foto':action==='delete_rejected'?'todas las fotos rechazadas':'TODAS las fotos del evento';if(!confirm(`¿Eliminar ${label}?\n\nEsta accion es permanente y no se puede deshacer.`))return;el.partyPhotoCleanupNotice.textContent='Eliminando de Storage y base de datos…';try{const d=await invokePhotoManager(action,photoId);el.partyPhotoCleanupNotice.textContent=`✅ ${d.deleted||0} foto(s) eliminada(s) · ${formatPhotoBytes(d.bytes)} liberados`;toast('🧹 Limpieza completada',`${d.deleted||0} foto(s) eliminada(s)`,'success');await loadPartyPhotos();await loadPartyPhotoStats()}catch(e){el.partyPhotoCleanupNotice.textContent=e.message;toast('No se pudo eliminar',e.message,'error')}}
let karaokeState={nomination:'self',round:null,entries:[],ranking:[],active:null,timer:null,screenTimer:null,pollTimer:null,selectedMusic:null,manualSong:false,searchTimer:null,searchSeq:0,usage:{used:0,limit:10},projectionInFlight:false,lastProjectionCheck:0};
function scheduleKaraokeMusicSearch(){clearTimeout(karaokeState.searchTimer);const q=el.karaokeMusicSearch.value.trim();el.clearKaraokeMusicSearch.hidden=!q;if(q.length<3){el.karaokeMusicResults.hidden=true;el.karaokeMusicSearchStatus.textContent=q?'Escribe al menos 3 caracteres.':'';return}el.karaokeMusicSearchStatus.textContent='Buscando canciones…';karaokeState.searchTimer=setTimeout(()=>searchKaraokeMusic(q),280)}
function searchKaraokeMusic(query){const seq=++karaokeState.searchSeq,callback=`karaokeItunes_${Date.now()}_${seq}`,script=document.createElement('script'),timeout=setTimeout(()=>finish('La búsqueda tardó demasiado. Intenta nuevamente.'),8000);function cleanup(){clearTimeout(timeout);delete window[callback];script.remove()}function finish(error,data){if(seq!==karaokeState.searchSeq){cleanup();return}cleanup();if(error){el.karaokeMusicSearchStatus.textContent=error;el.karaokeMusicResults.hidden=true;return}renderKaraokeMusicResults(data.results||[])}window[callback]=data=>finish(null,data);script.onerror=()=>finish('No fue posible consultar el catálogo musical.');script.src=`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=CL&media=music&entity=song&limit=8&lang=en_us&callback=${encodeURIComponent(callback)}`;document.body.appendChild(script)}
function renderKaraokeMusicResults(items){const unique=[],seen=new Set();for(const x of items){const key=`${x.trackName}|${x.artistName}`.toLowerCase();if(!seen.has(key)){seen.add(key);unique.push(x)}}el.karaokeMusicSearchStatus.textContent=unique.length?'Selecciona la canción correcta:':'No encontramos resultados. Puedes escribirla manualmente.';el.karaokeMusicResults.hidden=!unique.length;el.karaokeMusicResults.innerHTML=unique.slice(0,6).map((x,i)=>`<button type="button" class="karaoke-music-result" data-karaoke-music-result="${i}"><img src="${esc((x.artworkUrl100||'').replace('100x100','200x200'))}" alt=""><span><b>${esc(x.trackName)}</b><small>${esc(x.artistName)}${x.collectionName?' · '+esc(x.collectionName):''}</small></span><i>＋</i></button>`).join('');el.karaokeMusicResults.querySelectorAll('[data-karaoke-music-result]').forEach((b,i)=>b.onclick=()=>selectKaraokeMusic(unique[i]))}
function selectKaraokeMusic(x){clearTimeout(karaokeState.searchTimer);karaokeState.searchSeq++;el.karaokeMusicResults.innerHTML='';el.karaokeMusicResults.hidden=true;el.karaokeMusicSearch.value='';el.clearKaraokeMusicSearch.hidden=true;karaokeState.selectedMusic={title:x.trackName,artist:x.artistName,artwork_url:(x.artworkUrl100||'').replace('100x100','300x300')};karaokeState.manualSong=false;el.karaokeSong.value=x.trackName;el.karaokeArtist.value=x.artistName;el.karaokeManualFields.hidden=true;el.karaokeSelectedMusic.hidden=false;el.karaokeSelectedMusic.innerHTML=`<img src="${esc(karaokeState.selectedMusic.artwork_url)}" alt=""><span><small>CANCIÓN SELECCIONADA</small><b>${esc(x.trackName)}</b><em>${esc(x.artistName)}</em></span><button type="button" aria-label="Quitar canción">×</button>`;el.karaokeSelectedMusic.querySelector('button').onclick=clearKaraokeSelectedMusic;el.karaokeMusicResults.hidden=true;el.karaokeMusicSearchStatus.textContent='Canción seleccionada ✓';el.karaokeMusicSearch.value='';el.clearKaraokeMusicSearch.hidden=true}
function clearKaraokeSelectedMusic(){karaokeState.selectedMusic=null;el.karaokeSong.value='';el.karaokeArtist.value='';el.karaokeSelectedMusic.hidden=true;el.karaokeMusicSearchStatus.textContent='';el.karaokeMusicSearch.focus()}
function toggleKaraokeManualSong(){karaokeState.manualSong=!karaokeState.manualSong;if(karaokeState.manualSong)clearKaraokeSelectedMusic();el.karaokeManualFields.hidden=!karaokeState.manualSong;el.karaokeManualToggle.textContent=karaokeState.manualSong?'🔎 Volver al buscador musical':'✍️ No encuentro la canción, escribir manualmente';if(karaokeState.manualSong)el.karaokeSong.focus();else el.karaokeMusicSearch.focus()}
async function loadKaraokeUsage(){if(!db||!eventId||session)return;const {data,error}=await db.rpc('get_my_karaoke_usage_v5334',{p_event_id:eventId,p_visitor_id:visitorToken});if(error)return;karaokeState.usage=data||{used:0,limit:10};if(el.karaokeUsageCount)el.karaokeUsageCount.textContent=`${karaokeState.usage.used||0} / ${karaokeState.usage.limit||10}`;if(el.submitKaraoke)el.submitKaraoke.disabled=(karaokeState.usage.used||0)>=(karaokeState.usage.limit||10)}
async function invokeKaraokeManager(action,entryId=null){const {data:sd,error:se}=await db.auth.getSession(),token=sd?.session?.access_token;if(se||!token)throw new Error('Sesion DJ no disponible');const {data,error}=await db.functions.invoke('manage-karaoke',{headers:{Authorization:`Bearer ${token}`},body:{action,event_id:eventId,entry_id:entryId}});if(error||!data?.ok)throw new Error(data?.error||error?.message||'Error gestionando Karaoke');return data}
async function loadKaraokeStats(){if(!session||!eventId||!el.karaokeCleanup)return;try{const d=await invokeKaraokeManager('stats'),s=d.stats||{};el.karaokeStatRounds.textContent=Number(s.rounds)||0;el.karaokeStatEntries.textContent=Number(s.entries)||0;el.karaokeStatFinished.textContent=Number(s.finished)||0;el.karaokeStatRatings.textContent=Number(s.ratings)||0;el.deleteFinishedKaraoke.disabled=!(Number(s.finished)>0);el.deleteAllKaraoke.disabled=!(Number(s.rounds)>0||Number(s.entries)>0)}catch(e){el.karaokeCleanupNotice.textContent=e.message}}
async function deleteKaraokeData(action,entryId=null){const label=action==='delete_one'?'esta participación':action==='delete_finished'?'todos los participantes finalizados':'TODO el Karaoke del evento';if(!confirm(`¿Eliminar ${label}?\n\nSe borrarán también sus valoraciones. Esta acción es permanente.`))return;el.karaokeCleanupNotice.textContent='Eliminando datos…';try{const d=await invokeKaraokeManager(action,entryId);el.karaokeCleanupNotice.textContent=`✅ ${d.deleted_entries||0} participante(s), ${d.deleted_ratings||0} valoración(es) y ${d.deleted_rounds||0} ronda(s) eliminadas`;toast('🧹 Karaoke limpiado',`${d.deleted_entries||0} participación(es) eliminadas`,'success');await loadKaraokeState();await loadKaraokeStats();await syncProjectedKaraoke()}catch(e){el.karaokeCleanupNotice.textContent=e.message;toast('No se pudo eliminar',e.message,'error')}}
function karaokeStatusLabel(s){return({pending:'Pendiente',approved:'En cola',called:'Llamando',performing:'Cantando',rating_open:'Valoración abierta',finished:'Finalizado',rejected:'Rechazado'})[s]||s}function karaokeCallStatus(x){if(x.status!=='called')return'';if(x.acknowledged_at)return'<span class="karaoke-call-ok">✅ Confirmó · Viene a la pista</span>';const elapsed=x.called_at?(Date.now()-new Date(x.called_at))/1000:0;return elapsed>=20?'<span class="karaoke-call-missed">⚠️ Sin confirmación</span>':'<span class="karaoke-call-wait">📞 Llamando…</span>'}
async function loadKaraokeState(){if(!db||!eventId)return;const {data,error}=await db.rpc('get_karaoke_state_v533',{p_event_id:eventId,p_visitor_id:visitorToken,p_moderation:!!session});if(error){console.warn('Karaoke V5.33:',error.message);return}const d=data||{};karaokeState.round=d.round||null;karaokeState.entries=d.entries||[];karaokeState.ranking=d.ranking||[];karaokeState.active=d.active_rating||null;renderKaraokeGuest();if(session){renderKaraokeDj();await loadKaraokeStats()}else await loadKaraokeUsage()}
function karaokeRankingHtml(list){return(list||[]).length?list.map((x,i)=>`<article class="karaoke-rank-row ${x.eligible?'eligible':'pending-votes'}"><span>${['🥇','🥈','🥉'][i]||i+1}</span><div><b>${esc(x.singer_name)}</b><small>${esc(x.song_title)}${x.song_artist?' · '+esc(x.song_artist):''}</small></div><strong>${x.eligible?`⭐ ${Number(x.average).toFixed(2)} · ${x.votes} votos`:`${x.votes} votos · mínimo pendiente`}</strong></article>`).join(''):'<div class="summary-empty">Aún no hay resultados.</div>'}
function renderKaraokeGuest(){if(!el.karaokeGuestCard)return;el.karaokeGuestCard.hidden=!karaokeState.round;el.karaokeGuestState.textContent=karaokeState.round?.registrations_open?'INSCRIPCIONES':'EN CURSO';el.karaokeRegistration.hidden=!karaokeState.round?.registrations_open;const a=karaokeState.active;el.karaokeRating.hidden=!a;if(a){el.karaokeRatingSinger.textContent=a.singer_name;el.karaokeRatingSong.textContent=`${a.song_title}${a.song_artist?' · '+a.song_artist:''}`;karaokeTick()}el.karaokeGuestRanking.innerHTML=karaokeRankingHtml(karaokeState.ranking)}
function karaokeTick(){clearInterval(karaokeState.timer);const tick=()=>{const a=karaokeState.active;if(!a)return;const left=Math.max(0,Math.ceil((new Date(a.rating_closes_at)-Date.now())/1000));const mins=Math.floor(left/60);
const secs=left%60;
el.karaokeRatingClock.textContent=`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;if(!left){clearInterval(karaokeState.timer);loadKaraokeState()}};tick();karaokeState.timer=setInterval(tick,1000)}
async function submitKaraokeEntry(){const singer=el.karaokeSinger.value.trim(),song=karaokeState.selectedMusic?.title||el.karaokeSong.value.trim(),artist=karaokeState.selectedMusic?.artist||el.karaokeArtist.value.trim(),proposer=el.karaokeProposer.value.trim();if((karaokeState.usage.used||0)>=(karaokeState.usage.limit||10)){el.karaokeGuestNotice.textContent='🎤 Alcanzaste el máximo de 10 participaciones para esta ronda.';return}if(karaokeState.nomination==='proposed'&&!el.karaokeConsent.checked){el.karaokeGuestNotice.textContent='☑️ Confirma que la persona aceptó participar del Karaoke.';return}if(!singer){el.karaokeGuestNotice.textContent='Ingresa el nombre de quien cantará.';return}if(!song){el.karaokeGuestNotice.textContent='Busca y selecciona una canción, o escríbela manualmente.';return}const {error}=await db.rpc('submit_karaoke_entry_v533',{p_event_id:eventId,p_visitor_id:visitorToken,p_singer_name:singer,p_song_title:song,p_song_artist:artist||null,p_proposer_name:proposer||getGuestNickname()||null,p_nomination_type:karaokeState.nomination,p_consent_confirmed:karaokeState.nomination==='self'||el.karaokeConsent.checked});if(error){el.karaokeGuestNotice.textContent=error.message.includes('consent_required')?'☑️ Confirma que la persona aceptó participar.':error.message.includes('entry_limit_reached')?'🎤 Alcanzaste el máximo de 10 participaciones para esta ronda.':error.message.includes('registrations_closed')?'Las inscripciones de Karaoke están cerradas.':error.message;return}el.karaokeGuestNotice.textContent='✅ Participación enviada. Esperando aprobación del DJ.';el.karaokeSinger.value=el.karaokeSong.value=el.karaokeArtist.value='';karaokeState.selectedMusic=null;el.karaokeSelectedMusic.hidden=true;el.karaokeMusicSearch.value='';el.karaokeMusicSearchStatus.textContent='';toast('🎤 Inscripción enviada','El DJ revisará la participación','success');await loadKaraokeState()}
async function rateKaraoke(n){const a=karaokeState.active;if(!a)return;const {error}=await db.rpc('rate_karaoke_entry_v533',{p_entry_id:a.id,p_visitor_id:visitorToken,p_rating:Number(n)});el.karaokeRatingNotice.textContent=error?(error.message.includes('self_rating')?'El dispositivo del participante no puede autocalificarse.':error.message):`✅ Valoración guardada: ${n} estrellas`;if(!error)haptic('reaction')}
function renderKaraokeDj(){if(!el.karaokeDjCard)return;const entries=karaokeState.entries||[];el.karaokeDjNotice.textContent=karaokeState.round?`Karaoke activo · premio: ${karaokeState.round.prize||'Sin definir'}`:'Abre una competencia para recibir inscripciones.';el.karaokeEntries.innerHTML=entries.length?entries.map(x=>`<article class="karaoke-entry"><div><b>🎤 ${esc(x.singer_name)}</b><span>${esc(x.song_title)}${x.song_artist?' · '+esc(x.song_artist):''}</span><small>${x.nomination_type==='proposed'?'Propuesto por '+esc(x.proposer_name||'invitado'):'Inscripción propia'} · ${karaokeStatusLabel(x.status)}</small>${karaokeCallStatus(x)}</div><div class="karaoke-entry-actions">${x.status==='pending'?`<button data-karaoke-status="approved" data-karaoke-id="${x.id}">✅ Aprobar</button><button data-karaoke-status="rejected" data-karaoke-id="${x.id}">❌</button>`:''}${x.status==='approved'?`<button data-karaoke-call="${x.id}">📞🎤 LLAMAR A ${esc(x.singer_name)}</button><button data-karaoke-status="performing" data-karaoke-id="${x.id}">▶️ Iniciar</button>`:''}${x.status==='called'?`<button data-karaoke-call="${x.id}">📞 VOLVER A LLAMAR</button><button data-karaoke-status="performing" data-karaoke-id="${x.id}">▶️ Iniciar</button>`:''}${x.status==='performing'?`<button data-karaoke-status="rating_open" data-karaoke-id="${x.id}">⭐ Valorar</button>`:''}${x.status==='rating_open'?`<button data-karaoke-status="finished" data-karaoke-id="${x.id}">🏁 Cerrar</button>`:''}<button class="danger" data-karaoke-delete="${x.id}">🗑️ Eliminar</button></div></article>`).join(''):'<div class="summary-empty">Sin participantes.</div>';el.karaokeDjRanking.innerHTML=karaokeRankingHtml(karaokeState.ranking);const winner=karaokeState.ranking.find(x=>x.eligible);el.projectKaraokeWinner.disabled=!winner;el.projectKaraokeWinner.dataset.entryId=winner?.id||''}
async function startKaraokeRound(){const {error}=await db.rpc('start_karaoke_round_v533',{p_event_id:eventId,p_prize:el.karaokePrize.value.trim()||null,p_min_votes:Number(el.karaokeMinVotes.value)||5,p_rating_seconds:Number(el.karaokeRatingSeconds.value)||60});if(error){el.karaokeDjNotice.textContent=error.message;return}toast('🎤 Karaoke abierto','Los invitados ya pueden inscribirse','success');await loadKaraokeState()}
async function updateKaraokeEntry(id,status){const {error}=await db.rpc('update_karaoke_entry_v533',{p_entry_id:id,p_status:status});if(error){toast('No se pudo actualizar',error.message,'error');return}toast('🎤 Karaoke actualizado',karaokeStatusLabel(status),'success');await loadKaraokeState()}
(()=>{const st=document.createElement('style');st.textContent='.karaoke-call-alert{position:fixed;z-index:40000;inset:0;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 50% 30%,rgba(250,204,21,.25),rgba(4,2,10,.97) 62%)}.karaoke-call-alert[hidden]{display:none}.karaoke-call-alert>div{text-align:center;max-width:560px}.karaoke-call-alert span{display:block;font-size:5rem}.karaoke-call-alert small{color:#fde68a;font-weight:1000;letter-spacing:.18em}.karaoke-call-alert h2{font-size:clamp(2.5rem,10vw,5rem);margin:12px 0;color:#fff}.karaoke-call-alert h3{font-size:clamp(1.2rem,5vw,2rem);color:#f9a8d4}.karaoke-call-alert p{color:#ddd6fe}.karaoke-call-alert button{min-height:58px;border:0;border-radius:16px;padding:0 22px;background:linear-gradient(135deg,#facc15,#f97316);color:#1c0b00;font-weight:1000}.karaoke-call-alert.calling-mode{animation:karaokeCallFlash 1s ease-in-out infinite alternate}.karaoke-call-ok,.karaoke-call-missed,.karaoke-call-wait{display:block;margin-top:5px;font-size:.68rem;font-weight:900}.karaoke-call-ok{color:#86efac}.karaoke-call-missed{color:#fda4af}.karaoke-call-wait{color:#fde68a}@keyframes karaokeCallFlash{from{box-shadow:inset 0 0 0 0 rgba(250,204,21,.12)}to{box-shadow:inset 0 0 90px 18px rgba(250,204,21,.2)}}';document.head.appendChild(st)})();
// KARAOKE_CALL_ALERT_V535
// KARAOKE_CALL_MODE_V5353
let karaokeCallToneTimer=null,karaokeCallStopTimer=null;
function stopKaraokeCallMode(){clearInterval(karaokeCallToneTimer);clearTimeout(karaokeCallStopTimer);karaokeCallToneTimer=karaokeCallStopTimer=null;try{navigator.vibrate?.(0)}catch{}}
function playKaraokeRingPulse(){try{const A=window.AudioContext||window.webkitAudioContext,ctx=new A(),seq=[[740,0],[880,.32],[740,.64],[980,.96]];seq.forEach(([hz,t])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';o.frequency.value=hz;g.gain.setValueAtTime(.0001,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(.28,ctx.currentTime+t+.03);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+t+.28);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.3)});setTimeout(()=>ctx.close(),1700)}catch{}}
async function acknowledgeKaraokeCall(entryId,box){try{const {error}=await db.rpc('acknowledge_karaoke_call_v5353',{p_entry_id:entryId,p_visitor_id:visitorToken});if(error)throw error;stopKaraokeCallMode();box?.remove();toast('🎤 Confirmación enviada','El DJ ya sabe que vas a la pista','success')}catch(e){toast('No se pudo confirmar',e.message||'','error')}}
function showKaraokeCallAlert(d){if(!d||session||String(d.target_visitor_id||d.visitor_id||'')!==visitorToken)return;let box=document.getElementById('karaokeCallAlert');if(box)box.remove();box=document.createElement('section');box.id='karaokeCallAlert';box.className='karaoke-call-alert calling-mode';box.innerHTML=`<div><span>📞🎤</span><small>¡KARAOKE TE ESTÁ LLAMANDO!</small><h2 id="karaokeCallSinger"></h2><h3 id="karaokeCallSong"></h3><p>🔥 Es tu turno. Acércate ahora a la pista.</p><button type="button" id="karaokeCallConfirm">🎤 ¡VOY PARA LA PISTA!</button></div>`;document.body.appendChild(box);box.querySelector('#karaokeCallSinger').textContent=String(d.singer_name||'CANTANTE').toUpperCase();box.querySelector('#karaokeCallSong').textContent=`${d.song_title||''}${d.song_artist?' · '+d.song_artist:''}`;box.querySelector('#karaokeCallConfirm').onclick=()=>acknowledgeKaraokeCall(d.id||d.karaoke_entry_id,box);stopKaraokeCallMode();vibrateParty([1800,700,1800,700,1800,700,1800]);playKaraokeRingPulse();karaokeCallToneTimer=setInterval(playKaraokeRingPulse,2100);karaokeCallStopTimer=setTimeout(stopKaraokeCallMode,10000)}

async function sendKaraokeCallPush(entry,isRecall=false){const {data:sd,error:se}=await db.auth.getSession(),token=sd?.session?.access_token;if(se||!token)throw new Error('Sesión DJ no disponible');const proposed=entry.nomination_type==='proposed';const message=proposed?`¡Es el turno de ${entry.singer_name}! Avísale que debe acercarse a la pista. ${entry.song_title}${entry.song_artist?' · '+entry.song_artist:''}`:`${entry.singer_name}, ¡es tu turno! ${entry.song_title}${entry.song_artist?' · '+entry.song_artist:''}. Ven a la pista 🔥`;const {data,error}=await db.functions.invoke('send-event-push',{headers:{Authorization:`Bearer ${token}`},body:{event_id:eventId,message,priority:'urgent',duration_seconds:30,sound_enabled:true,notification_type:'karaoke_call',karaoke_entry_id:entry.id,title:isRecall?'🎤 ¡TE ESTAMOS ESPERANDO!':'🎤 ¡ES TU TURNO!'}});if(error||!data?.ok)throw new Error(data?.error||error?.message||'No se pudo enviar el Push');return data}
async function projectKaraoke(id,type='call'){const entry=karaokeState.entries.find(x=>x.id===id);const isRecall=type==='call'&&entry?.status==='called';const {error}=await db.rpc('project_karaoke_v533',{p_event_id:eventId,p_entry_id:id,p_type:type,p_seconds:60});if(error){toast('No se pudo proyectar',error.message,'error');return}if(type==='call'){try{const push=await sendKaraokeCallPush(entry,isRecall);toast('📞 Llamado Karaoke enviado',`${push.sent||0} dispositivo(s) notificado(s)`,'success')}catch(e){toast('Karaoke proyectado, Push no enviado',e.message,'error')}const {error:markError}=await db.rpc('mark_karaoke_called_v5353',{p_entry_id:id});if(markError)toast('No se pudo marcar el llamado',markError.message,'error');await loadKaraokeState()}toast('🎬 Karaoke enviado a Pantalla Fiesta',type==='winner'?'¡Tenemos ganador!':'Cantante llamado','success');await syncProjectedKaraoke()}

function startKaraokeProjectionPolling(){
  if(karaokeState.pollTimer) return;
  if(!screenModeActive) return;

  if(!document.hidden){
    syncProjectedKaraoke();
  }

  karaokeState.pollTimer=setInterval(()=>{
    if(
      screenModeActive &&
      !document.hidden &&
      !karaokeState.projectionInFlight
    ){
      syncProjectedKaraoke();
    }
  },5000);
}

function stopKaraokeProjectionPolling(){
  clearInterval(karaokeState.pollTimer);
  karaokeState.pollTimer=null;
  karaokeState.projectionInFlight=false;
}

async function clearProjectedKaraoke(){await db.rpc('clear_projected_karaoke_v533',{p_event_id:eventId});hideProjectedKaraoke()}
function hasPriorityProjection(){
  return Boolean(
    (el.screenPartyPhoto && !el.screenPartyPhoto.hidden) ||
    (el.screenPartyGreeting && !el.screenPartyGreeting.hidden) ||
    (el.screenKaraoke && !el.screenKaraoke.hidden) ||
    (el.screenDedication && !el.screenDedication.hidden)
  );
}

function hideProjectedKaraoke(){
  if(el.screenKaraoke) el.screenKaraoke.hidden=true;

  clearTimeout(karaokeState.screenTimer);
  karaokeState.screenTimer=null;

  if(
    screenModeActive &&
    partyScreen.auto &&
    !partyScreen.timer &&
    !hasPriorityProjection()
  ){
    partyRestartTimer();
  }
}
async function syncProjectedKaraoke(){
  if(
    !db ||
    !eventId ||
    !el.screenKaraoke ||
    karaokeState.projectionInFlight
  ) return;

  const now=Date.now();

  if(now-karaokeState.lastProjectionCheck<1500) return;

  karaokeState.projectionInFlight=true;
  karaokeState.lastProjectionCheck=now;

  try{
    const {data,error}=await db.functions.invoke(
      'get-projected-karaoke',
      {
        body:{event_id:eventId}
      }
    );

    if(error || !data?.ok || !data?.karaoke){
      hideProjectedKaraoke();
      return;
    }

    const k=data.karaoke;
    const winner=k.type==='winner';

    el.screenKaraokeIcon.textContent=winner?'🏆':'🎤';
    el.screenKaraokeKicker.textContent=
      winner?'GANADOR DEL KARAOKE':'PRÓXIMO CANTANTE';

    el.screenKaraokeSingerLabel.textContent=
      winner?'GANADOR':'CANTA AHORA';

    el.screenKaraokeSinger.textContent=
      String(k.singer_name||'CANTANTE').trim().toUpperCase();

    el.screenKaraokeSong.textContent=
      `${k.song_title}${k.song_artist?' · '+k.song_artist:''}`;

    el.screenKaraokeMeta.textContent=
      k.proposer_name
        ? `Propuesto por ${k.proposer_name}`
        : 'Karaoke espontáneo';

    el.screenKaraokeScore.textContent=
      winner
        ? `⭐ ${Number(k.average).toFixed(2)} · ${k.votes} votos`
        : '';

    el.screenKaraoke.hidden=false;

    clearInterval(partyScreen.timer);
    partyScreen.timer=null;

    clearTimeout(karaokeState.screenTimer);

    const remaining=Math.max(
      1000,
      new Date(k.until).getTime()-Date.now()
    );

    karaokeState.screenTimer=setTimeout(()=>{
      hideProjectedKaraoke();

      if(
        screenModeActive &&
        partyScreen.auto &&
        !hasPriorityProjection()
      ){
        partyRestartTimer();
        partyAdvance(1);
      }
    },remaining);

  } finally {
    karaokeState.projectionInFlight=false;
  }
}

// MUSIC_DEDICATION_V545
  // DEDICATION_SCREEN_SYNC_V5451
  let dedicationScreenSyncTimer=null;
  let dedicationScreenFeaturedId=undefined;

  function isPartyScreenPage(){
    const params=new URLSearchParams(location.search);

    return (
      params.get('modo')==='pantalla' ||
      params.get('pantalla')==='1' ||
      document.body.classList.contains('screen-mode')
    );
  }

  async function syncDedicationPartyScreen(){

    if(
      !isPartyScreenPage() ||
      !eventId ||
      document.hidden
    ){
      return;
    }

    const {data,error}=await db
      .from('events')
      .select('featured_request_id')
      .eq('id',eventId)
      .maybeSingle();

    if(error || !data){
      return;
    }

    const currentId=
      data.featured_request_id || null;

    if(
      dedicationScreenFeaturedId === undefined
    ){
      dedicationScreenFeaturedId=currentId;
      return;
    }

    if(
      currentId !==
      dedicationScreenFeaturedId
    ){
      dedicationScreenFeaturedId=currentId;

      /*
       * Recargar Pantalla Fiesta cuando:
       * - se proyecta una dedicatoria;
       * - se quita;
       * - se marca como dedicada;
       * - se elimina.
       *
       * La recarga reconstruye correctamente
       * la escena o devuelve el carrusel.
       */
      location.reload();
    }
  }

  function startDedicationPartyScreenSync(){

    if(
      dedicationScreenSyncTimer ||
      !isPartyScreenPage()
    ){
      return;
    }

    dedicationScreenSyncTimer=setInterval(
      syncDedicationPartyScreen,
      2000
    );

    syncDedicationPartyScreen();
  }


  let dedicationState={items:[],selected:null,manual:false,searchTimer:null,searchSeq:0,inFlight:false};
  function dedicationStatusLabel(s){return({pending:'Pendiente',approved:'Aprobada',queued:'En cola',projected:'Proyectada',dedicated:'Ya dedicada',rejected:'Rechazada'})[s]||s}
  function scheduleDedicationSearch(){clearTimeout(dedicationState.searchTimer);const q=el.dedicationMusicSearch.value.trim();el.clearDedicationMusicSearch.hidden=!q;if(q.length<3){el.dedicationMusicResults.hidden=true;el.dedicationMusicSearchStatus.textContent=q?'Escribe al menos 3 caracteres.':'';return}el.dedicationMusicSearchStatus.textContent='Buscando canciones…';dedicationState.searchTimer=setTimeout(()=>searchDedicationMusic(q),280)}
  function searchDedicationMusic(query){const seq=++dedicationState.searchSeq,cb=`dedicationItunes_${Date.now()}_${seq}`,script=document.createElement('script'),timeout=setTimeout(()=>finish('La búsqueda tardó demasiado.'),8000);function clean(){clearTimeout(timeout);delete window[cb];script.remove()}function finish(error,data){if(seq!==dedicationState.searchSeq){clean();return}clean();if(error){el.dedicationMusicSearchStatus.textContent=error;el.dedicationMusicResults.hidden=true;return}renderDedicationResults(data.results||[])}window[cb]=d=>finish(null,d);script.onerror=()=>finish('No fue posible consultar el catálogo.');script.src=`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=CL&media=music&entity=song&limit=8&callback=${encodeURIComponent(cb)}`;document.body.appendChild(script)}
  function renderDedicationResults(items){const out=[],seen=new Set();for(const x of items){const k=`${x.trackName}|${x.artistName}`.toLowerCase();if(!seen.has(k)){seen.add(k);out.push(x)}}el.dedicationMusicSearchStatus.textContent=out.length?'Selecciona la canción correcta:':'No encontramos resultados.';el.dedicationMusicResults.hidden=!out.length;el.dedicationMusicResults.innerHTML=out.slice(0,6).map((x,i)=>`<button type="button" class="music-result" data-dedication-result="${i}"><img class="music-cover" src="${esc((x.artworkUrl100||'').replace('100x100','200x200'))}" alt=""><span class="music-copy"><b>${esc(x.trackName)}</b><span>${esc(x.artistName)}</span></span><span class="music-add">＋</span></button>`).join('');el.dedicationMusicResults.querySelectorAll('[data-dedication-result]').forEach((b,i)=>b.onclick=()=>selectDedicationMusic(out[i]))}
  function selectDedicationMusic(x){dedicationState.selected={title:x.trackName,artist:x.artistName,artwork_url:(x.artworkUrl100||'').replace('100x100','300x300'),external_track_id:String(x.trackId||''),external_url:x.trackViewUrl||''};dedicationState.manual=false;el.dedicationManualFields.hidden=true;el.dedicationMusicResults.hidden=true;
el.dedicationMusicResults.innerHTML='';
el.dedicationMusicSearch.blur();
el.dedicationSelectedMusic.hidden=false;el.dedicationSelectedMusic.innerHTML=`<img class="music-cover" src="${esc(dedicationState.selected.artwork_url)}" alt=""><span class="music-copy"><b>${esc(x.trackName)}</b><span>${esc(x.artistName)}</span></span><button type="button">×</button>`;el.dedicationSelectedMusic.querySelector('button').onclick=clearDedicationMusic;el.dedicationMusicSearch.value='';el.clearDedicationMusicSearch.hidden=true;el.dedicationMusicSearchStatus.textContent='Canción seleccionada ✓'}
  function clearDedicationMusic(){dedicationState.selected=null;el.dedicationSelectedMusic.hidden=true;el.dedicationMusicSearchStatus.textContent=''}
  function toggleDedicationManual(){dedicationState.manual=!dedicationState.manual;if(dedicationState.manual)clearDedicationMusic();el.dedicationManualFields.hidden=!dedicationState.manual;el.dedicationManualToggle.textContent=dedicationState.manual?'🔎 Volver al buscador':'✍️ No encuentro la canción'}
  async function submitMusicDedication(){if(dedicationState.inFlight)return;const recipient=el.dedicationRecipient.value.trim(),message=el.dedicationText.value.trim(),title=dedicationState.selected?.title||el.dedicationSongTitle.value.trim(),artist=dedicationState.selected?.artist||el.dedicationSongArtist.value.trim();if(!recipient||!message||!title){el.musicDedicationGuestNotice.textContent='Completa destinatario, canción y mensaje.';return}dedicationState.inFlight=true;el.submitMusicDedication.disabled=true;const {error}=await db.rpc('submit_music_dedication_v545',{p_event_id:eventId,p_visitor_id:visitorToken,p_recipient:recipient,p_sender_name:el.dedicationSender.value.trim()||null,p_message:message,p_song_title:title,p_song_artist:artist||null,p_artwork_url:dedicationState.selected?.artwork_url||null,p_external_track_id:dedicationState.selected?.external_track_id||null,p_external_url:dedicationState.selected?.external_url||null});dedicationState.inFlight=false;el.submitMusicDedication.disabled=false;if(error){el.musicDedicationGuestNotice.textContent=error.message.includes('pending_dedication')?'Ya tienes una dedicatoria esperando aprobación.':error.message.includes('dedication_limit')?'Alcanzaste el máximo de 5 dedicatorias.':error.message;return}el.musicDedicationGuestNotice.textContent='✅ Dedicatoria enviada. Esperando aprobación del DJ.';el.dedicationRecipient.value=el.dedicationText.value=el.dedicationSender.value=el.dedicationSongTitle.value=el.dedicationSongArtist.value='';clearDedicationMusic();toast('💞 Dedicatoria enviada','El DJ la revisará','success');await loadMusicDedications()}
  function dedicationCard(d,dj=false){const actions=!dj?'':`<div class="music-dedication-actions">${d.status==='pending'?`<button data-dedication-action="approved" data-id="${d.id}">✅ Aprobar</button><button data-dedication-action="rejected" data-id="${d.id}">❌</button>`:''}${d.status==='approved'?`<button data-dedication-action="queue" data-id="${d.id}">🎵 Poner en cola</button>`:''}${['approved','queued','projected'].includes(d.status)?`<button data-dedication-action="project" data-id="${d.id}">🎬 Proyectar</button><button data-dedication-action="dedicated" data-id="${d.id}">✅ Ya fue dedicada</button>`:''}<button class="danger" data-dedication-action="delete" data-id="${d.id}">🗑️</button></div>`;return `<article class="music-dedication-item"><div class="music-dedication-cover">${d.artwork_url?`<img src="${esc(d.artwork_url)}" alt="">`:'💞'}</div><div><small>PARA ${esc(d.recipient)}</small><b>${esc(d.song_title)}</b><span>${esc(d.song_artist||'Artista por confirmar')}</span><p>“${esc(d.message)}”</p><em>${d.sender_name?'De '+esc(d.sender_name):'De un invitado'} · ${dedicationStatusLabel(d.status)}</em></div>${actions}</article>`}
  async function loadMusicDedications(){if(!db||!eventId||!el.musicDedicationGuest)return;const {data,error}=await db.rpc('get_music_dedications_v545',{p_event_id:eventId,p_visitor_id:visitorToken,p_moderation:!!session});if(error){console.warn('Dedicatorias V5.45:',error.message);return}dedicationState.items=data||[];if(session){const p=dedicationState.items.filter(x=>x.status==='pending'),m=dedicationState.items.filter(x=>x.status!=='pending');el.musicDedicationPending.innerHTML=p.map(x=>dedicationCard(x,true)).join('')||'<div class="summary-empty">Sin dedicatorias pendientes.</div>';el.musicDedicationManaged.innerHTML=m.map(x=>dedicationCard(x,true)).join('')||'<div class="summary-empty">Sin dedicatorias gestionadas.</div>';const {data:s}=await db.rpc('music_dedication_stats_v545',{p_event_id:eventId});el.musicDedicationKpis.innerHTML=['total','pending','approved','dedicated','rejected'].map(k=>`<article><b>${Number(s?.[k])||0}</b><small>${k}</small></article>`).join('')}else{el.myMusicDedications.innerHTML=dedicationState.items.map(x=>dedicationCard(x,false)).join('');el.musicDedicationUsage.textContent=`${dedicationState.items.length} / 5`}}
  async function sendDedicationApprovedPush(d){const {data:sd}=await db.auth.getSession(),token=sd?.session?.access_token;if(!token)return;await db.functions.invoke('send-event-push',{headers:{Authorization:`Bearer ${token}`},body:{event_id:eventId,message:`Tu dedicatoria para ${d.recipient} fue aprobada. Luis DJ la tiene preparada 🎧`,priority:'important',duration_seconds:15,sound_enabled:true,target_visitor_id:d.visitor_id,notification_type:'dedication_approved',title:'💞 ¡Dedicatoria aprobada!'}})}
  async function manageMusicDedication(id,action){const {data,error}=await db.rpc('manage_music_dedication_v545',{p_dedication_id:id,p_action:action});if(error){toast('No se pudo actualizar',error.message,'error');return}if(action==='approved')await sendDedicationApprovedPush(data.dedication);toast('💞 Dedicatoria actualizada',dedicationStatusLabel(data.dedication?.status||action),'success');await loadMusicDedications();if(['queue','project'].includes(action))await refreshRows()}
  async function cleanupMusicDedications(mode){if(!confirm(mode==='all'?'¿Borrar TODAS las dedicatorias?':'¿Borrar dedicatorias rechazadas?'))return;const {data,error}=await db.rpc('cleanup_music_dedications_v545',{p_event_id:eventId,p_mode:mode});if(error){el.musicDedicationDjNotice.textContent=error.message;return}el.musicDedicationDjNotice.textContent=`✅ ${data||0} dedicatoria(s) eliminada(s)`;await loadMusicDedications()}
  let greetingState={type:'greeting',pending:[],approved:[],timer:null};
async function invokeGreetingManager(action,greetingId=null){const {data:sd,error:se}=await db.auth.getSession(),token=sd?.session?.access_token;if(se||!token)throw new Error('Sesion DJ no disponible');const {data,error}=await db.functions.invoke('manage-party-greetings',{headers:{Authorization:`Bearer ${token}`},body:{action,event_id:eventId,greeting_id:greetingId}});if(error||!data?.ok)throw new Error(data?.error||error?.message||'Error gestionando saludos');return data}
async function loadGreetingStats(){if(!session||!eventId||!el.partyGreetingCleanup)return;try{const d=await invokeGreetingManager('stats'),s=d.stats||{};el.greetingTotal.textContent=Number(s.total)||0;el.greetingPending.textContent=Number(s.pending)||0;el.greetingApprovedCount.textContent=Number(s.approved)||0;el.greetingRejected.textContent=Number(s.rejected)||0;el.deleteRejectedGreetings.disabled=!(Number(s.rejected)>0);el.deleteAllGreetings.disabled=!(Number(s.total)>0)}catch(e){el.greetingCleanupNotice.textContent=e.message}}
async function deletePartyGreetings(action,greetingId=null){const label=action==='delete_one'?'este saludo':action==='delete_rejected'?'todos los saludos rechazados':'TODOS los saludos del evento';if(!confirm(`¿Eliminar ${label}?\n\nEsta accion es permanente y no se puede deshacer.`))return;el.greetingCleanupNotice.textContent='Eliminando saludos…';try{const d=await invokeGreetingManager(action,greetingId);el.greetingCleanupNotice.textContent=`✅ ${d.deleted||0} saludo(s) eliminado(s)`;toast('🧹 Limpieza completada',`${d.deleted||0} saludo(s) eliminado(s)`,'success');await loadPartyGreetings();await loadGreetingStats();await syncProjectedGreeting()}catch(e){el.greetingCleanupNotice.textContent=e.message;toast('No se pudo eliminar',e.message,'error')}}
const GREETING_META={greeting:['💌','SALUDO DE LA FIESTA'],dedication:['❤️','DEDICATORIA'],celebration:['🎂','CELEBRACIÓN']};
async function sendPartyGreeting(){const recipient=el.greetingRecipient.value.trim(),message=el.greetingMessage.value.trim(),sender=el.greetingSender.value.trim();if(!recipient||!message){el.greetingGuestNotice.textContent='Completa destinatario y saludo.';return}const {error}=await db.rpc('submit_party_greeting_v5311',{p_event_id:eventId,p_visitor_id:visitorToken,p_type:greetingState.type,p_recipient:recipient,p_message:message,p_sender_name:sender||null,p_photo_id:null});if(error){el.greetingGuestNotice.textContent=error.message.includes('pending_greeting')?'Ya tienes un saludo esperando aprobación.':error.message.includes('greeting_limit')?'Llegaste al máximo de 5 saludos.':error.message;return}el.greetingRecipient.value='';el.greetingMessage.value='';el.greetingGuestNotice.textContent='✅ Saludo enviado. Esperando aprobación del DJ.';haptic('reaction');toast('💌 Saludo enviado','El DJ debe aprobarlo antes de proyectarlo','success')}
async function loadPartyGreetings(){if(!session||!eventId)return;const {data,error}=await db.rpc('get_party_greetings_v5311',{p_event_id:eventId,p_moderation:true});if(error)return;const all=data||[];greetingState.pending=all.filter(x=>x.status==='pending');greetingState.approved=all.filter(x=>x.status==='approved');const render=(list,approved)=>list.length?list.map(g=>{const m=GREETING_META[g.greeting_type]||GREETING_META.greeting;return `<article class="greeting-admin-item"><span class="greeting-admin-icon">${m[0]}</span><div><small>${m[1]} · Para ${esc(g.recipient)}</small><p>“${esc(g.message)}”</p><strong>${g.sender_name?'De '+esc(g.sender_name):'Anónimo'}</strong></div><div class="greeting-admin-actions">${approved?`<button data-greeting-project="${g.id}">🎬 Proyectar</button><button data-greeting-clear="1">⏹ Quitar</button><button class="danger" data-greeting-delete="${g.id}">🗑️ Eliminar</button>`:`<button data-greeting-moderate="approved" data-greeting-id="${g.id}">✅</button><button data-greeting-moderate="rejected" data-greeting-id="${g.id}">❌</button><button class="danger" data-greeting-delete="${g.id}">🗑️ Eliminar</button>`}</div></article>`}).join(''):'<div class="summary-empty">Sin mensajes.</div>';el.partyGreetingPending.innerHTML=render(greetingState.pending,false);el.partyGreetingApproved.innerHTML=render(greetingState.approved,true);await loadGreetingStats()}
async function moderatePartyGreeting(id,status){const {error}=await db.rpc('moderate_party_greeting_v5311',{p_greeting_id:id,p_status:status});if(error){toast('No se pudo moderar',error.message,'error');return}toast(status==='approved'?'✅ Saludo aprobado':'❌ Saludo rechazado','','success');await loadPartyGreetings()}
async function projectPartyGreeting(id){const {error}=await db.rpc('project_party_greeting_v5311',{p_event_id:eventId,p_greeting_id:id,p_seconds:12});if(error){toast('No se pudo proyectar',error.message,'error');return}toast('🎬 Saludo enviado a Pantalla Fiesta','Se mostrará durante 12 segundos','success');await syncProjectedGreeting()}
async function clearProjectedGreeting(){await db.rpc('clear_projected_greeting_v5311',{p_event_id:eventId});hideProjectedGreeting()}
function hideProjectedGreeting(){if(el.screenPartyGreeting)el.screenPartyGreeting.hidden=true;clearTimeout(greetingState.timer);greetingState.timer=null;if(screenModeActive&&partyScreen.auto&&!partyScreen.timer)partyRestartTimer()}
// GREETING_SCREEN_OPT_V5462
let greetingScreenPoll=null;
let greetingScreenRequestInFlight=false;
let greetingScreenLastRequest=0;

async function syncProjectedGreeting(force=false){

  if(
    !db ||
    !eventId ||
    !el.screenPartyGreeting
  ){
    return;
  }

  const now=Date.now();

  if(greetingScreenRequestInFlight){
    return;
  }

  if(
    !force &&
    now-greetingScreenLastRequest < 1500
  ){
    return;
  }

  greetingScreenRequestInFlight=true;
  greetingScreenLastRequest=now;

  try{

    const {data,error}=await db.functions.invoke(
      'get-projected-greeting',
      {
        body:{
          event_id:eventId
        }
      }
    );

    /*
     * Un error temporal no debe destruir una
     * proyección válida que ya esté visible.
     */
    if(error){
      console.warn(
        'Pantalla Fiesta greeting:',
        error.message
      );
      return;
    }

    if(!data?.ok || !data?.greeting){

      hideProjectedGreeting();

      return;
    }

    const g=data.greeting;

    const meta546={
      greeting:['💌','SALUDO DE LA FIESTA'],
      dedication:['❤️','UN MENSAJE PARA...'],
      celebration:['🎂','¡HOY CELEBRAMOS!'],
      toast:['🥂','¡LEVANTEN SUS COPAS!'],
      funny:['😂','MENSAJE DE LA FIESTA'],
      free:['✨','MENSAJE ESPECIAL']
    };

    const m=
      meta546[g.greeting_type] ||
      meta546.greeting;

    el.screenGreetingIcon.textContent=m[0];

    el.screenGreetingType.textContent=
      g.is_featured
        ? '⭐ MENSAJE ESPECIAL'
        : m[1];

    el.screenGreetingRecipient.textContent=
      `Para ${g.recipient}`;

    el.screenGreetingMessage.textContent=
      `“${g.message}”`;

    el.screenGreetingSender.textContent=
      g.sender_name
        ? `De ${g.sender_name}`
        : 'De un invitado';

    if(el.screenGreetingPhoto){
      el.screenGreetingPhoto.hidden=!g.photo_url;
    }

    if(
      g.photo_url &&
      el.screenGreetingPhotoImg
    ){
      el.screenGreetingPhotoImg.src=g.photo_url;
    }

    el.screenPartyGreeting.className=
      `screen-party-greeting greeting-screen-v546 type-${g.greeting_type}`;

    el.screenPartyGreeting.hidden=false;

    clearInterval(partyScreen.timer);
    partyScreen.timer=null;

    /*
     * V5.46:
     * El DJ controla cuánto permanece en pantalla.
     * No usamos aquí un timeout automático.
     */
    clearTimeout(greetingState.timer);
    greetingState.timer=null;

  }finally{

    greetingScreenRequestInFlight=false;

  }
}

function startGreetingScreenPolling(){

  if(greetingScreenPoll){
    return;
  }

  greetingScreenPoll=setInterval(()=>{

    if(
      screenModeActive &&
      !document.hidden &&
      !greetingScreenRequestInFlight
    ){
      syncProjectedGreeting();
    }

  },5000);
}

function stopGreetingScreenPolling(){

  clearInterval(greetingScreenPoll);

  greetingScreenPoll=null;

  greetingScreenRequestInFlight=false;
}
// PHOTO_MOBILE_ROBUST_V5463
function photoSizeLabel(bytes){
  const value=Number(bytes)||0;

  if(value<1024){
    return `${value} B`;
  }

  if(value<1024*1024){
    return `${(value/1024).toFixed(1)} KB`;
  }

  return `${(value/(1024*1024)).toFixed(1)} MB`;
}

async function preparePartyPhoto(file,status){

  if(!file){
    throw new Error('No se seleccionó una fotografía.');
  }

  if(
    !String(file.type||'').startsWith('image/')
  ){
    throw new Error(
      'El archivo seleccionado no es una imagen válida.'
    );
  }

  status.textContent=
    `📸 Preparando fotografía · ${photoSizeLabel(file.size)}…`;

  let bitmap=null;
  let objectUrl=null;

  try{

    if('createImageBitmap' in window){
      bitmap=await createImageBitmap(
        file,
        {
          imageOrientation:'from-image'
        }
      );
    }else{
      objectUrl=URL.createObjectURL(file);

      bitmap=await new Promise((resolve,reject)=>{
        const image=new Image();

        image.onload=()=>resolve(image);
        image.onerror=()=>reject(
          new Error('No pudimos leer esta fotografía.')
        );

        image.src=objectUrl;
      });
    }

    const sourceWidth=
      bitmap.naturalWidth ||
      bitmap.width;

    const sourceHeight=
      bitmap.naturalHeight ||
      bitmap.height;

    if(!sourceWidth || !sourceHeight){
      throw new Error(
        'No pudimos determinar el tamaño de la fotografía.'
      );
    }

    const maxSide=1600;

    const scale=Math.min(
      1,
      maxSide/Math.max(
        sourceWidth,
        sourceHeight
      )
    );

    const width=Math.max(
      1,
      Math.round(sourceWidth*scale)
    );

    const height=Math.max(
      1,
      Math.round(sourceHeight*scale)
    );

    const canvas=document.createElement('canvas');

    canvas.width=width;
    canvas.height=height;

    const context=canvas.getContext(
      '2d',
      {
        alpha:false
      }
    );

    if(!context){
      throw new Error(
        'Este navegador no pudo preparar la fotografía.'
      );
    }

    context.fillStyle='#000';
    context.fillRect(
      0,
      0,
      width,
      height
    );

    context.drawImage(
      bitmap,
      0,
      0,
      width,
      height
    );

    const blob=await new Promise(resolve=>{
      canvas.toBlob(
        resolve,
        'image/jpeg',
        0.82
      );
    });

    if(!blob){
      throw new Error(
        'No pudimos comprimir la fotografía.'
      );
    }

    if(blob.size>5*1024*1024){
      throw new Error(
        `La fotografía preparada todavía pesa ${photoSizeLabel(blob.size)}. El máximo permitido es 5 MB.`
      );
    }

    return new File(
      [blob],
      `foto-${Date.now()}.jpg`,
      {
        type:'image/jpeg',
        lastModified:Date.now()
      }
    );

  }finally{

    if(bitmap?.close){
      bitmap.close();
    }

    if(objectUrl){
      URL.revokeObjectURL(objectUrl);
    }
  }
}

// PHOTO_ACTIVE_ROUND_V54631
async function resolveActivePhotoRound(){

  const {data,error}=await db.rpc(
    'get_social_experience_v530',
    {
      p_event_id:eventId,
      p_visitor_id:visitorToken
    }
  );

  if(error){
    throw new Error(
      'No pudimos comprobar Foto del Momento: ' +
      error.message
    );
  }

  const activePhoto=
    (data?.rounds||[])
      .find(round=>round.kind==='photo');

  if(!activePhoto?.id){
    throw new Error(
      'Foto del Momento ya no está activa. Actualiza la fiesta.'
    );
  }

  return activePhoto.id;
}

async function uploadPartyPhoto(roundId,file){

  const status=
    el.socialPartyGuestList.querySelector(
      `[data-party-photo-status="${roundId}"]`
    );

  if(!file || !status){
    return;
  }

  const originalSize=file.size;

  try{

    status.textContent=
      '🔎 Comprobando Foto del Momento…';

    /*
     * No confiamos en el roundId que estaba
     * renderizado en el celular.
     *
     * Consultamos nuevamente la ronda activa
     * justo antes de subir.
     */
    const activeRoundId=
      await resolveActivePhotoRound();

    if(activeRoundId!==roundId){

      console.info(
        'Foto del Momento: ronda actualizada',
        {
          anterior:roundId,
          activa:activeRoundId
        }
      );

      roundId=activeRoundId;
    }

    const prepared=await preparePartyPhoto(
      file,
      status
    );

    status.textContent=
      `⬆️ Subiendo fotografía · ${photoSizeLabel(prepared.size)}…`;

    const path=
      `${eventId}/${roundId}/` +
      `${visitorToken}-${crypto.randomUUID()}.jpg`;

    const {error:uploadError}=await db.storage
      .from('party-photos')
      .upload(
        path,
        prepared,
        {
          contentType:'image/jpeg',
          upsert:false,
          cacheControl:'3600'
        }
      );

    if(uploadError){
      throw new Error(
        `No se pudo subir: ${uploadError.message}`
      );
    }

    const {error:registerError}=await db.rpc(
      'register_party_photo_v5301',
      {
        p_round_id:roundId,
        p_visitor_id:visitorToken,
        p_storage_path:path
      }
    );

    if(registerError){

      await db.storage
        .from('party-photos')
        .remove([path])
        .catch(()=>{});

      if(
        registerError.message.includes('photo_limit')
      ){
        throw new Error(
          'Máximo 3 fotos por ronda.'
        );
      }

      throw registerError;
    }

    status.textContent=
      `✅ Foto enviada · ` +
      `${photoSizeLabel(originalSize)} → ` +
      `${photoSizeLabel(prepared.size)}. ` +
      `Esperando aprobación del DJ.`;

    haptic('reaction');

    toast(
      '📸 Foto enviada',
      'Será visible solo si el DJ la aprueba',
      'success'
    );

  }catch(error){

    const message=
      error instanceof Error
        ? error.message
        : String(error);

    status.textContent=
      `❌ ${message}`;

    toast(
      'No se pudo enviar la foto',
      message,
      'error'
    );
  }
}
async function signedPartyPhoto(path){const {data,error}=await db.storage.from('party-photos').createSignedUrl(path,300);return error?null:data.signedUrl}
async function loadPartyPhotos(){if(!db||!eventId)return;if(!session){return}const {data,error}=await db.rpc('get_party_photos_v5301',{p_event_id:eventId,p_moderation:true});if(error){console.warn('Fotos V5.30.1:',error.message);return}const all=data||[];partyPhotoState.pending=all.filter(x=>x.status==='pending');partyPhotoState.approved=all.filter(x=>x.status==='approved');el.partyPhotoModeration.hidden=!(socialState.rounds.some(x=>x.kind==='photo')||all.length);el.partyPhotoPendingCount.textContent=partyPhotoState.pending.length;const render=async(list,approved)=>{const rows=[];for(const x of list){const url=await signedPartyPhoto(x.storage_path);if(url)rows.push(`<article class="party-photo-item" data-photo-id="${x.id}"><img src="${url}" alt="Foto de invitado">${approved?'':`<div class="party-photo-actions"><button data-photo-moderate="approved" data-photo-id="${x.id}">✅</button><button data-photo-moderate="rejected" data-photo-id="${x.id}">❌</button></div>`}${approved?`<div class="party-photo-actions"><button data-project-photo="${x.id}">🎬 Proyectar</button><button data-clear-photo="1">⏹ Quitar</button><button class="danger" data-delete-photo="${x.id}">🗑️ Eliminar</button></div>`:`<div class="party-photo-delete-row"><button class="danger" data-delete-photo="${x.id}">🗑️ Eliminar</button></div>`}</article>`)}return rows.join('')};el.partyPhotoQueue.innerHTML=await render(partyPhotoState.pending,false)||'<div class="summary-empty">Sin fotos pendientes.</div>';el.partyPhotoApproved.innerHTML=await render(partyPhotoState.approved,true)||'<div class="summary-empty">Sin fotos aprobadas.</div>';await loadPartyPhotoStats()}
async function moderatePartyPhoto(id,status){const {error}=await db.rpc('moderate_party_photo_v5301',{p_photo_id:id,p_status:status});if(error){toast('No se pudo moderar',error.message,'error');return}toast(status==='approved'?'✅ Foto aprobada':'❌ Foto rechazada','',status==='approved'?'success':'info');await loadPartyPhotos()}
async function projectPartyPhoto(id){const x=partyPhotoState.approved.find(p=>p.id===id);if(!x){toast('Foto no disponible','','error');return}const {error}=await db.rpc('project_party_photo_v5302',{p_event_id:eventId,p_photo_id:id,p_seconds:30});if(error){toast('No se pudo proyectar',error.message,'error');return}toast('🎬 Foto enviada a Pantalla Fiesta','Se mostrará durante 30 segundos','success');await syncProjectedPhoto()}
async function clearProjectedPartyPhoto(){const {error}=await db.rpc('clear_projected_photo_v5302',{p_event_id:eventId});if(error){toast('No se pudo quitar',error.message,'error');return}toast('⏹ Foto retirada de Pantalla Fiesta','','success');hideProjectedPartyPhoto()}
function hideProjectedPartyPhoto(){
  if(el.screenPartyPhoto)el.screenPartyPhoto.hidden=true;
  if(el.screenPartyPhotoImg)el.screenPartyPhotoImg.removeAttribute('src');

  clearTimeout(partyPhotoState.projectTimer);
  partyPhotoState.projectTimer=null;

  if(
    screenModeActive &&
    partyScreen.auto &&
    !partyScreen.timer &&
    !hasPriorityProjection()
  ){
    partyRestartTimer();
  }
}
// PHOTO_SCREEN_ROBUST_V54632
let photoScreenPoll=null;
let photoScreenRequestInFlight=false;
let photoScreenLastRequest=0;

async function syncProjectedPhoto(force=false){
  if(!db||!eventId||!el.screenPartyPhoto)return;

  const now=Date.now();

  if(photoScreenRequestInFlight)return;

  if(
    !force &&
    now-photoScreenLastRequest < 1500
  )return;

  photoScreenRequestInFlight=true;
  photoScreenLastRequest=now;

  let data=null;
  let error=null;

  try{
    const result=await db.functions.invoke(
      'get-projected-photo',
      {
        body:{
          event_id:eventId
        }
      }
    );

    data=result.data;
    error=result.error;

  }finally{
    photoScreenRequestInFlight=false;
  }

  if(error||!data?.ok||!data?.photo){
    hideProjectedPartyPhoto();
    return;
  }

  const photo=data.photo;

  el.screenPartyPhotoImg.src=photo.url;
  el.screenPartyPhoto.hidden=false;

  // La foto tiene prioridad absoluta sobre el carrusel.
  clearInterval(partyScreen.timer);
  partyScreen.timer=null;

  clearTimeout(partyPhotoState.projectTimer);

  const ms=Math.max(
    0,
    new Date(photo.until).getTime()-Date.now()
  );

  partyPhotoState.projectTimer=setTimeout(()=>{
    hideProjectedPartyPhoto();

    // Reanudar automaticamente el carrusel.
    if(screenModeActive&&partyScreen.auto){
      partyRestartTimer();
      partyAdvance(1);
    }
  },ms||15000);
}

function startPhotoScreenPolling(){

  if(photoScreenPoll)return;

  // Consulta inmediata al abrir Pantalla Fiesta.
  syncProjectedPhoto(true);

  photoScreenPoll=setInterval(()=>{

    if(
      screenModeActive &&
      !document.hidden
    ){
      syncProjectedPhoto();
    }

  },5000);
}

function stopPhotoScreenPolling(){

  if(photoScreenPoll){
    clearInterval(photoScreenPoll);
  }

  photoScreenPoll=null;
  photoScreenRequestInFlight=false;
}

async function loadAnnouncements(){if(!db||!eventId)return;const {data,error}=await db.rpc('get_announcements_v523',{p_event_id:eventId,p_visitor_id:visitorToken});if(error){console.warn('Avisos V5.23:',error.message);return}const d=data||{};announcementState.active=d.active||null;if(!session&&announcementState.active&&announcementState.active.id!==announcementState.shownId)showAnnouncement(announcementState.active);if(session)renderAnnouncementHistory(d.history||[])}
function showAnnouncement(a){announcementState.shownId=a.id;clearTimeout(announcementState.timer);clearTimeout(announcementState.reminder);el.announcementCard.className=`announcement-card ${a.priority}`;el.announcementOverlayIcon.textContent=announcementIcon(a.priority);el.announcementOverlayKicker.textContent=a.priority==='urgent'?'AVISO URGENTE':a.priority==='important'?'AVISO IMPORTANTE':'AVISO DEL DJ';el.announcementOverlayMessage.textContent=a.message;el.announcementOverlayHint.textContent='Luis DJ · Atención a la fiesta';el.announcementOverlay.hidden=false;vibrateParty(announcementPattern(a.priority));if(a.sound_enabled)playAnnouncementTone(a.priority);db.rpc('mark_announcement_seen_v523',{p_announcement_id:a.id,p_visitor_id:visitorToken}).catch(()=>{});addPartyNotification('announcement',el.announcementOverlayKicker.textContent,a.message);const ms=Number(a.duration_seconds)||0;if(ms>0)announcementState.timer=setTimeout(()=>{el.announcementOverlay.hidden=true},ms*1000);if(a.priority!=='general')announcementState.reminder=setTimeout(()=>{if(!el.announcementOverlay.hidden){vibrateParty(a.priority==='urgent'?[300,120,400]:[180,100,180]);if(a.sound_enabled)playAnnouncementTone('general')}},5000)}
async function acknowledgeAnnouncement(){const a=announcementState.active;if(!a)return;const {error}=await db.rpc('ack_announcement_v523',{p_announcement_id:a.id,p_visitor_id:visitorToken});if(error)return;clearTimeout(announcementState.timer);clearTimeout(announcementState.reminder);el.announcementOverlay.hidden=true;haptic('reaction')}
function renderAnnouncementHistory(list){if(!el.announcementHistory)return;el.announcementHistory.innerHTML=list.length?list.map(x=>`<div class="announcement-history-row"><span><b>${announcementIcon(x.priority)} ${esc(x.message)}</b><small>${new Date(x.created_at).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})} · ${esc(x.priority)}</small></span><span class="announcement-history-metrics"><b>👀 ${x.seen_count||0}</b><b>✅ ${x.ack_count||0}</b></span></div>`).join(''):'<div class="summary-empty">Todavía no has enviado avisos.</div>'}
async function sendAnnouncement(){const message=el.announcementMessage.value.trim();if(!message){el.announcementAdminNotice.textContent='Escribe o selecciona un mensaje.';return}el.sendAnnouncement.disabled=true;el.announcementAdminNotice.textContent='Enviando Push…';const {data:sessionData,error:sessionError}=await db.auth.getSession();
const accessToken=sessionData?.session?.access_token;

if(sessionError||!accessToken){
  el.sendAnnouncement.disabled=false;
  el.announcementAdminNotice.textContent='Sesión DJ no disponible. Vuelve a iniciar sesión.';
  return;
}

const {data,error}=await db.functions.invoke('send-event-push',{
  headers:{
    Authorization:`Bearer ${accessToken}`
  },
  body:{
    event_id:eventId,
    message,
    priority:el.announcementPriority.value,
    duration_seconds:Number(el.announcementDuration.value),
    sound_enabled:el.announcementSound.checked
  }
});el.sendAnnouncement.disabled=false;if(error||!data?.ok){const detail=data?.error||error?.message||'No se pudo enviar el Push.';el.announcementAdminNotice.textContent=detail;toast('Push no enviado',detail,'error');return}el.announcementAdminNotice.innerHTML=`<div>📲 Aviso guardado y Push procesado.</div><div class="push-result"><span>Suscritos <b>${data.subscribed||0}</b></span><span>Enviados <b>${data.sent||0}</b></span><span>Fallidos <b>${data.failed||0}</b></span></div>`;el.announcementMessage.value='';toast('📲 Push enviado',`${data.sent||0} dispositivos`,'success');await loadAnnouncements()}
function closeMobileQuickSheet(){el.mobileQuickSheet.hidden=true;el.mobileQuickBackdrop.hidden=true;el.mobileBottomNav.classList.remove('sheet-open');el.mobileMiniPlayer?.classList.remove('sheet-open')}
function quickChips(items,type){return items.map((x,i)=>`<button type="button" data-quick-${type}="${type==='recent'?i:x.id}">${esc(x.title)}${x.artist?' · '+esc(x.artist):''}</button>`).join('')}
function openQuickRequest(){let recent=[];try{recent=JSON.parse(localStorage.getItem(recentSearchKey())||'[]')}catch{}const popular=rows.filter(x=>!['played','rejected'].includes(x.status)).slice(0,6);el.mobileQuickKicker.textContent='ACCESO RÁPIDO';el.mobileQuickTitle.textContent='🎵 ¿Qué quieres bailar?';el.mobileQuickContent.innerHTML=`<div class="quick-sheet-search"><input id="quickSheetSearchInput" placeholder="🔎 Buscar canción o artista" autocomplete="off"><button id="quickSheetSearchGo" class="primary" type="button">BUSCAR</button></div>${recent.length?`<small>🕐 RECIENTES</small><div class="quick-sheet-chips">${quickChips(recent,'recent')}</div>`:''}${popular.length?`<small>🔥 POPULARES EN ESTA FIESTA</small><div class="quick-sheet-chips">${quickChips(popular,'song')}</div>`:''}<button class="quick-sheet-footer" data-open-full="requestForm">Abrir formulario completo</button>`;showMobileQuickSheet()}
function openQuickRanking(){const list=rows.filter(x=>!['played','rejected'].includes(x.status)).slice(0,6);el.mobileQuickKicker.textContent='EN VIVO';el.mobileQuickTitle.textContent='🔥 Ranking';el.mobileQuickContent.innerHTML=`<div class="quick-ranking-list">${list.map((x,i)=>`<div class="quick-ranking-row"><span>${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span><b>${esc(x.title)}</b><small>${esc(x.artist||'')} · ♥ ${x.votes}</small></span><button class="vote" data-quick-vote="${x.id}">♥</button></div>`).join('')}</div><button class="quick-sheet-footer" data-open-full="ranking">Ver ranking completo</button>`;showMobileQuickSheet()}
function openQuickParty(){const a=window.__lastMyActivity||{},unread=readNotifications().filter(x=>!x.read).length;el.mobileQuickKicker.textContent='TU EXPERIENCIA';el.mobileQuickTitle.textContent='🎉 Tu Fiesta';el.mobileQuickContent.innerHTML=`<div class="quick-party-grid"><div class="quick-party-action"><b>${Number(a.requests)||0}</b><small>🎵 Pedidas</small></div><div class="quick-party-action"><b>${Number(a.votes)||0}</b><small>❤️ Votos</small></div><div class="quick-party-action"><b>${el.hubAchievements?.textContent||'0/6'}</b><small>🏅 Logros</small></div><div class="quick-party-action"><b>${unread}</b><small>🔔 Avisos</small></div></div><button class="quick-sheet-footer" data-open-full="myPartyHub">Ver Tu Fiesta completa</button>`;showMobileQuickSheet()}
function activePhotoRound(){return (socialState.rounds||[]).find(r=>r.kind==='photo')||null}
function openQuickPhoto(){const r=activePhotoRound();el.mobileQuickKicker.textContent=r?'ACTIVA AHORA':'FOTO DEL MOMENTO';el.mobileQuickTitle.textContent=r?'📸 Foto del Momento activa':'📸 Foto del Momento';if(r){el.mobileQuickContent.innerHTML=`<div class="quick-photo-active"><span>📸</span><strong>¡La recepción está abierta!</strong><p>Toma o elige una foto. El DJ deberá aprobarla antes de proyectarla.</p><button class="primary" type="button" data-photo-go="${r.id}">📸 TOMAR / ELEGIR FOTO</button></div>`}else{el.mobileQuickContent.innerHTML=`<div class="quick-photo-inactive"><span>📸</span><strong>Todavía no está activa</strong><p>Cuando Luis DJ abra la recepción podrás enviar tus fotos desde aquí.</p><button class="quick-sheet-footer" type="button" data-photo-close="1">ENTENDIDO</button></div>`}showMobileQuickSheet()}
function showMobileQuickSheet(){el.mobileQuickSheet.hidden=false;el.mobileQuickBackdrop.hidden=false;el.mobileBottomNav.classList.add('sheet-open');el.mobileMiniPlayer?.classList.add('sheet-open');haptic('vote')}
function openQuickByButton(button){const id=button.dataset.mobileTarget;if(id==='requestForm')openQuickRequest();else if(id==='ranking')openQuickRanking();else if(id==='photoMoment')openQuickPhoto();else if(id==='myPartyHub')openQuickParty();else{closeMobileQuickSheet();scrollMobileTarget(id)}}
function updateMobileMiniPlayer(){if(!el.mobileMiniPlayer)return;const playing=rows.find(x=>x.status==='playing');el.mobileMiniPlayer.hidden=!playing;if(!playing)return;el.mobileMiniTitle.textContent=playing.title||'Canción';el.mobileMiniArtist.textContent=playing.artist||'Artista por confirmar';el.mobileMiniCover.innerHTML=playing.artwork_url?`<img src="${esc(playing.artwork_url)}" alt="">`:'🎵'}
function updateMobileBottomNav(){if(!el.mobileBottomNav)return;const playing=rows.find(x=>x.status==='playing'),ids=new Set(getMySongIds()),mine=rows.filter(x=>ids.has(x.id)&&x.status!=='rejected'),myPlaying=mine.find(x=>x.status==='playing'),myNext=mine.find(x=>x.status==='next'),unread=readNotifications().filter(x=>!x.read).length,battle=liveState.battle,photoActive=!!activePhotoRound();if(el.mobilePhotoBadge){el.mobilePhotoBadge.hidden=!photoActive;el.mobilePhotoBadge.textContent=photoActive?'•':''}if(el.mobilePhotoAction)el.mobilePhotoAction.classList.toggle('active-photo',photoActive);if(myPlaying){el.mobileContextIcon.textContent='🔊';el.mobileContextLabel.textContent='¡Tu canción!';el.mobileContextAction.dataset.mobileTarget='nowPlaying'}else if(myNext){el.mobileContextIcon.textContent='🔥';el.mobileContextLabel.textContent='Tu canción viene';el.mobileContextAction.dataset.mobileTarget='myPartyHub'}else if(battle){el.mobileContextIcon.textContent='⚔️';el.mobileContextLabel.textContent='Batalla';el.mobileContextAction.dataset.mobileTarget='battleGuestCard'}else if(playing){el.mobileContextIcon.textContent='🔥';el.mobileContextLabel.textContent='Reaccionar';el.mobileContextAction.dataset.mobileTarget='liveReactions'}else{el.mobileContextIcon.textContent='🎉';el.mobileContextLabel.textContent='Mi Fiesta';el.mobileContextAction.dataset.mobileTarget='myPartyHub'}el.mobileContextBadge.hidden=!unread;el.mobileContextBadge.textContent=unread>9?'9+':unread}
function scrollMobileTarget(id){const target=document.getElementById(id);if(!target)return;target.scrollIntoView({behavior:'smooth',block:'start'});haptic('vote')}
function hubStatusPriority(s){return({playing:4,next:3,accepted:2,pending:1,played:0})[s]??0}
function renderMyPartyHub(activity={}){if(!el.myPartyHub)return;const nick=getGuestNickname?.()||'';el.myPartyHello.textContent=nick?`Hola, ${nick} 🔥`:'Hola 👋';el.myPartyEvent.textContent=currentEvent?.display_name||currentEvent?.name||'Tu fiesta';el.hubRequests.textContent=Number(activity.requests)||0;el.hubVotes.textContent=Number(activity.votes)||0;const defs=typeof achievementDefs!=='undefined'?achievementDefs:[],stats={requests:Number(activity.requests)||0,votes:Number(activity.votes)||0,played:Number(activity.played)||0},n=defs.filter(a=>{try{return a.test(stats)}catch{return false}}).length;el.hubAchievements.textContent=`${n}/${defs.length||6}`;el.hubPoints.textContent=el.gamePoints?.textContent||'0';el.myPartyLevel.textContent=el.gameLevel?.textContent?`🎧 ${el.gameLevel.textContent}`:'🎧 Invitado';const ids=new Set(getMySongIds()),mine=rows.filter(x=>ids.has(x.id)&&x.status!=='rejected').sort((a,b)=>hubStatusPriority(b.status)-hubStatusPriority(a.status)||b.votes-a.votes),song=mine[0];el.hubMySong.hidden=!song;if(song){const visual=song.artwork_url?`<img src="${esc(song.artwork_url)}" alt="">`:'<span class="hub-song-fallback">🎵</span>';el.hubMySong.innerHTML=`${visual}<span><b>${esc(song.title)}</b><small>${esc(song.artist||'Artista por confirmar')} · ♥ ${song.votes}</small></span><span class="hub-song-state ${esc(song.status)}">${labels[song.status]||song.status}</span>`}const actions=[];if(rows.some(x=>x.status==='playing'))actions.push({icon:'🔥',title:'Reacciona al tema',meta:reactionState.myReaction?`Tu reacción: ${reactionEmoji(reactionState.myReaction)}`:'¿Qué tal está sonando?',target:'liveReactions'});if(liveState.battle)actions.push({icon:'⚔️',title:'Batalla activa',meta:'Elige tu favorita',target:'battleGuestCard'});if(liveState.challenge)actions.push({icon:'⚡',title:'Reto activo',meta:`${liveState.challenge.current_value||0} / ${liveState.challenge.target_value||0}`,target:'challengeGuestCard'});if(!liveState.surprises?.some(x=>x.visitor_id===visitorToken&&['pending','accepted'].includes(x.status)))actions.push({icon:'🎁',title:'Sorpresa del DJ',meta:'Deja que el DJ elija por ti',target:'djSurpriseGuestCard'});if(!feedbackState.rating)actions.push({icon:'⭐',title:'Evalúa al DJ',meta:'Tu opinión ayuda a mejorar',target:'djFeedbackCard'});if(!actions.length)actions.push({icon:'🔥',title:'Sigue participando',meta:'Vota y ayuda a mover el ranking',target:'ranking'});el.hubActions.innerHTML=actions.slice(0,4).map(a=>`<button class="hub-action" type="button" data-hub-jump="${a.target}"><span><strong>${a.icon} ${esc(a.title)}</strong><small>${esc(a.meta)}</small></span><span class="arrow">›</span></button>`).join('')}
function refreshMyPartyHub(){renderMyPartyHub(window.__lastMyActivity||{});updateMobileBottomNav();updateMobileMiniPlayer();updateContextualSheet()}
const feedbackLabels={1:'Podemos mejorar',2:'Regular',3:'Buena',4:'Muy buena',5:'Excelente 🔥'};
function paintFeedback(){if(!el.feedbackStars)return;el.feedbackStars.querySelectorAll('[data-rating]').forEach(b=>b.classList.toggle('active',Number(b.dataset.rating)<=feedbackState.rating));el.feedbackTags.querySelectorAll('[data-tag]').forEach(b=>b.classList.toggle('active',feedbackState.tags.has(b.dataset.tag)));el.feedbackRatingText.textContent=feedbackState.rating?feedbackLabels[feedbackState.rating]:'Selecciona de 1 a 5 estrellas'}
async function loadMyFeedback(){if(!db||!eventId||session)return;const {data,error}=await db.rpc('get_my_feedback_v57',{p_event_id:eventId,p_visitor_id:visitorToken});if(error)return;if(data){feedbackState.rating=Number(data.rating)||0;feedbackState.tags=new Set(data.aspects||[]);el.feedbackComment.value=data.comment||'';el.feedbackSavedBadge.hidden=false;el.submitDjFeedback.textContent='⭐ ACTUALIZAR EVALUACION'}paintFeedback()}
async function saveFeedback(){if(!feedbackState.rating){el.feedbackNotice.textContent='Selecciona entre 1 y 5 estrellas.';return}const {error}=await db.rpc('submit_feedback_v57',{p_event_id:eventId,p_visitor_id:visitorToken,p_rating:feedbackState.rating,p_aspects:[...feedbackState.tags],p_comment:el.feedbackComment.value.trim()||null});if(error){el.feedbackNotice.textContent=error.message;return}el.feedbackNotice.textContent='Gracias. Tu opinion fue guardada.';el.feedbackSavedBadge.hidden=false;await loadMyFeedback();toast('⭐ Gracias por evaluar','Tu opinion ayuda a mejorar','success')}
async function loadFeedbackDashboard(){if(!db||!eventId||!session)return;const {data,error}=await db.rpc('get_feedback_dashboard_v57',{p_event_id:eventId});if(error){el.feedbackDashboardNotice.textContent=error.message;return}const d=data||{},count=Number(d.count)||0;el.feedbackDashboard.hidden=false;el.feedbackDashboardNotice.textContent='';el.feedbackAverage.textContent=(Number(d.average)||0).toFixed(1);el.feedbackCount.textContent=count+' evaluaciones';el.feedbackDistribution.innerHTML=[5,4,3,2,1].map(n=>{const v=Number(d.distribution?.[String(n)])||0,p=count?Math.round(v*100/count):0;return '<div class="feedback-dist-row"><span>'+n+' estrellas</span><span class="feedback-track"><i style="width:'+p+'%"></i></span><b>'+v+'</b></div>'}).join('');el.feedbackAspects.innerHTML=(d.aspects||[]).map(x=>'<div class="feedback-aspect"><span>'+esc(x.label)+'</span><span class="feedback-track"><i style="width:'+(count?Math.round(Number(x.value)*100/count):0)+'%"></i></span><b>'+x.value+'</b></div>').join('')||'<div class="summary-empty">Sin datos.</div>';el.feedbackComments.innerHTML=(d.comments||[]).map(x=>'<article class="feedback-comment"><span>'+('★'.repeat(Number(x.rating)||0))+'</span><p>'+esc(x.comment)+'</p></article>').join('')||'<div class="summary-empty">Sin comentarios.</div>'}
async function loadLiveExperience(){if(!db||!eventId)return;const {data,error}=await db.rpc('get_live_experience_v56',{p_event_id:eventId,p_visitor_id:visitorToken});if(error){console.warn('Experiencia V5.2-V5.6:',error.message);return}const d=data||{};const oldBattle=liveState.battle?.id,oldChallenge=liveState.challenge?.id;liveState.battle=d.battle||null;liveState.challenge=d.challenge||null;if(liveState.battle?.id&&liveState.battle.id!==oldBattle)addPartyNotification('battle','Nueva batalla','Elige tu favorita');if(liveState.challenge?.id&&liveState.challenge.id!==oldChallenge)addPartyNotification('challenge','Nuevo reto',liveState.challenge.title||'Participa en el reto');liveState.surprises=d.surprises||[];renderNextUp();renderTrends(d.trends||[]);renderBattle();renderChallenge();populateBattleSongs();renderSurpriseAdmin();if(session)loadFeedbackDashboard();else loadMyFeedback();refreshMyPartyHub();if(el.endBattle)el.endBattle.disabled=!liveState.battle;if(el.endChallenge)el.endChallenge.disabled=!liveState.challenge;el.djSurpriseStatus.textContent=d.my_surprise?`Estado: ${d.my_surprise.status}`:''}
async function loadMyActivity(){if(!db||!eventId||session||!el.myActivityNotice)return;el.myActivityNotice.hidden=false;el.myActivityContent.hidden=true;el.myActivityNotice.textContent='Cargando tu actividad…';const {data,error}=await db.rpc('get_my_event_activity_v502',{p_event_id:eventId,p_visitor_id:visitorToken});if(error){el.myActivityNotice.textContent='No se pudo cargar tu actividad.';console.warn('Mi actividad V5.0.2:',error.message);return}const d=data||{};window.__lastMyActivity=d;renderAchievements(d);renderMyPartyHub(d);el.myRequests.textContent=Number(d.requests)||0;el.myVotes.textContent=Number(d.votes)||0;el.myPlayed.textContent=Number(d.played)||0;const songs=d.songs||[];el.mySongs.innerHTML=songs.length?songs.map(x=>`<div class="my-song"><div><strong>${esc(x.title)}</strong><small>${x.artist?esc(x.artist)+' · ':''}${Number(x.votes)||0} ❤️</small></div><span class="my-song-status ${esc(x.status||'pending')}">${myActivityStatusLabel(x.status)}</span></div>`).join(''):'<div class="activity-empty">Aún no has pedido canciones en este evento. 🎵</div>';el.myActivityNotice.hidden=true;el.myActivityContent.hidden=false}
// ===== V5.0.1 IDENTIDAD OPCIONAL =====
function guestNicknameKey(){return `pide_tu_tema_nickname:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}`}
function getGuestNickname(){return (localStorage.getItem(guestNicknameKey())||'').trim()}
function renderGuestIdentity(){if(!el.guestNickname)return;const n=getGuestNickname();el.guestNickname.value=n;el.guestIdentityStatus.innerHTML=n?`Estás participando como <strong>${esc(n)}</strong>.`:'Estás participando de forma anónima.'}
async function saveGuestIdentity(){if(!eventId)return;const nickname=el.guestNickname.value.trim().slice(0,30);if(nickname)localStorage.setItem(guestNicknameKey(),nickname);else localStorage.removeItem(guestNicknameKey());const {error}=await db.rpc('set_event_guest_identity_v501',{p_event_id:eventId,p_visitor_id:visitorToken,p_nickname:nickname||null});if(error){toast('No se pudo guardar el nombre',error.message,'error');return}renderGuestIdentity();toast(nickname?'👋 Perfil actualizado':'🕶️ Modo anónimo',nickname||'Tu identidad quedó oculta','success')}
async function clearGuestIdentity(){el.guestNickname.value='';await saveGuestIdentity()}
// ===== V4.5.3 ANALYTICS DE PARTICIPACION =====
async function trackEngagement(action,requestId=null){if(!db||!eventId||session||new URLSearchParams(location.search).get('modo')==='pantalla')return;const {error}=await db.rpc('track_event_engagement_v453',{p_event_id:eventId,p_visitor_id:visitorToken,p_action:action,p_request_id:requestId});if(error)console.warn('Analytics V4.5.3:',error.message)}
function renderEngagement(d){if(!el.eRate)return;const visitors=Number(d.visitors)||0,requests=Number(d.requests)||0,requesters=Number(d.requesters)||0,voters=Number(d.voters)||0,votes=Number(d.votes)||0,played=Number(d.played)||0;const engaged=Number(d.engaged)||0,rate=visitors?Math.min(100,Math.round(engaged*100/visitors)):0;el.eRate.textContent=`${rate}%`;el.eRequests.textContent=requests;el.eRequesters.textContent=requesters;el.eVoters.textContent=voters;el.eVotes.textContent=votes;el.ePlayed.textContent=played;const stages=[['Visitantes',visitors],['Pidieron',requesters],['Votaron',voters],['Reproducidas',played]],max=Math.max(1,visitors,...stages.map(x=>x[1]));el.eFunnel.innerHTML=stages.map(([label,n])=>`<div class="funnel-row"><span>${label}</span><span class="funnel-track"><i style="width:${Math.round(n*100/max)}%"></i></span><b>${n}</b></div>`).join('')}
async function loadVisitorAnalytics(){if(!session||!eventId||!el.analyticsNotice)return;el.analyticsNotice.hidden=false;el.analyticsNotice.textContent='Cargando estadísticas…';el.analyticsContent.hidden=true;const {data,error}=await db.rpc('get_event_analytics_v452',{p_event_id:eventId});if(error){el.analyticsNotice.textContent='No se pudieron cargar las estadísticas: '+error.message;return}const d=data||{},devices=d.devices||[],total=Number(d.visitors)||0,dm=analyticsMap(devices);el.aVisitors.textContent=total;el.aMobile.textContent=dm.get('mobile')||0;el.aTablet.textContent=dm.get('tablet')||0;el.aDesktop.textContent=dm.get('desktop')||0;el.aPeakHour.textContent=d.peak_hour===null||d.peak_hour===undefined?'Sin datos':`${String(d.peak_hour).padStart(2,'0')}:00 a ${String((Number(d.peak_hour)+1)%24).padStart(2,'0')}:00`;el.aPeakMeta.textContent=d.peak_count?`${d.peak_count} conexión${d.peak_count===1?'':'es'}`:'Esperando conexiones';const fmt=v=>v?new Date(v).toLocaleString('es-CL',{dateStyle:'short',timeStyle:'short'}):'—';el.aFirstSeen.textContent=fmt(d.first_seen);el.aLastSeen.textContent=fmt(d.last_seen);analyticsBars(el.aDevices,devices,total);analyticsBars(el.aOs,d.os||[],total);analyticsBars(el.aBrowsers,d.browsers||[],total);const hours=d.hours||[],max=Math.max(1,...hours.map(x=>Number(x.value)||0));el.aHours.innerHTML=hours.length?hours.map(x=>{const n=Number(x.value)||0;return `<div class="hour-bar"><i style="height:${Math.max(3,Math.round(n*100/max))}%"></i><b>${n}</b><small>${String(x.label).padStart(2,'0')}h</small></div>`}).join(''):'<div class="summary-empty">Sin conexiones todavía</div>';renderEngagement(d);el.analyticsUpdated.textContent=`Actualizado ${new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})}`;el.analyticsNotice.hidden=true;el.analyticsContent.hidden=false}

// ===== V4.5.1 ANALYTICS DE VISITANTES =====


function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(title,text='',type='info'){const node=document.createElement('div');node.className=`toast ${type}`;node.innerHTML=`<strong>${esc(title)}</strong><span>${esc(text)}</span>`;el.toast.appendChild(node);setTimeout(()=>{node.classList.add('out');setTimeout(()=>node.remove(),260)},4200)}
function beep(){if(!soundEnabled)return;try{const A=window.AudioContext||window.webkitAudioContext,ctx=new A(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=880;gain.gain.setValueAtTime(.09,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.22);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.23)}catch{}}
function browserNotify(title,body){if('Notification'in window&&Notification.permission==='granted'&&document.hidden)new Notification(title,{body,icon:'',tag:'pide-tu-tema'})}
function updateBadge(){el.newBadge.hidden=!unseen;el.newBadge.textContent=unseen>99?'99+':unseen;document.title=unseen?`(${unseen}) Pide Tu Tema | Luis DJ`:'Pide Tu Tema | Luis DJ'}
function setConnection(ok,text){el.connectionBar.classList.toggle('offline',!ok);el.connectionText.textContent=text}
function setNotice(text,error=false){el.notice.textContent=text;el.notice.style.color=error?'#fecdd3':'#a7f3d0'}
const surpriseCatalog={fiesta:{label:'🔥 Prender la pista',songs:[['Danza Kuduro','Don Omar & Lucenzo'],['Gasolina','Daddy Yankee'],['La Vida Es Un Carnaval','Celia Cruz'],['September','Earth, Wind & Fire'],['I Gotta Feeling','The Black Eyed Peas'],['Uptown Funk','Mark Ronson feat. Bruno Mars']]},cumbia:{label:'💃 Cumbia',songs:[['Mentirosa','Ráfaga'],['Una Cerveza','Ráfaga'],['Yo Tomo Licor','Amar Azul'],['Que Nadie Sepa Mi Sufrir','La Sonora Dinamita'],['Nunca Me Faltes','Antonio Ríos'],['La Dueña del Swing','Los Hermanos Rosario']]},reggaeton:{label:'🔥 Reggaetón',songs:[['Dile','Don Omar'],['Rakata','Wisin & Yandel'],['Lo Que Pasó, Pasó','Daddy Yankee'],['Atrévete-te-te','Calle 13'],['Mayor Que Yo','Luny Tunes'],['Yo Voy','Zion & Lennox feat. Daddy Yankee']]},cantar:{label:'🎤 Para cantar',songs:[['Corazón Partío','Alejandro Sanz'],['Rosas','La Oreja de Van Gogh'],['La Flaca','Jarabe de Palo'],['Antología','Shakira'],['Rayando el Sol','Maná'],['Persiana Americana','Soda Stereo']]},clasicos:{label:'🪩 Clásicos',songs:[['I Will Survive','Gloria Gaynor'],['YMCA','Village People'],['Billie Jean','Michael Jackson'],['Girls Just Want to Have Fun','Cyndi Lauper'],['Wake Me Up Before You Go-Go','Wham!'],['Dancing Queen','ABBA']]},latino:{label:'🎸 Latino',songs:[['De Música Ligera','Soda Stereo'],['Tren al Sur','Los Prisioneros'],['Lamento Boliviano','Enanitos Verdes'],['La Muralla Verde','Enanitos Verdes'],['Cuando Pase el Temblor','Soda Stereo'],['El Duelo','La Ley']]}};
function sampleSurprises(category,count=3){const pool=[...(surpriseCatalog[category]?.songs||[])];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,count)}
function renderSurpriseCategories(){el.surpriseCategories.innerHTML=Object.entries(surpriseCatalog).map(([key,v])=>`<button type="button" class="surprise-category ${key===surpriseCategory?'active':''}" data-surprise-category="${key}">${v.label}</button>`).join('');el.surpriseCategories.querySelectorAll('[data-surprise-category]').forEach(b=>b.onclick=()=>{surpriseCategory=b.dataset.surpriseCategory;renderSurpriseCategories();renderSurpriseSuggestions()})}
function renderSurpriseSuggestions(){const picks=sampleSurprises(surpriseCategory);el.surpriseSuggestions.innerHTML=picks.length?picks.map(([title,artist],i)=>`<article class="surprise-card"><div><b>${esc(title)}</b><span>${esc(artist)}</span></div><button type="button" class="surprise-pick" data-surprise-pick="${i}">Elegir</button></article>`).join(''):'<div class="surprise-note">No hay sugerencias para esta categoría.</div>';el.surpriseSuggestions.querySelectorAll('[data-surprise-pick]').forEach((b,i)=>b.onclick=()=>{const [title,artist]=picks[i];el.surprisePanel.hidden=true;el.musicSearch.value=`${title} ${artist}`;el.clearMusicSearch.hidden=false;el.musicSearchStatus.textContent='Buscando esta sugerencia…';searchMusic(`${title} ${artist}`)})}
function openSurprise(){el.surprisePanel.hidden=false;renderSurpriseCategories();renderSurpriseSuggestions();el.surprisePanel.scrollIntoView({behavior:'smooth',block:'nearest'})}
function scheduleMusicSearch(){clearTimeout(musicSearchTimer);const q=el.musicSearch.value.trim();el.clearMusicSearch.hidden=!q;if(q.length<3){el.musicResults.hidden=true;el.musicSearchStatus.textContent=q?'Escribe al menos 3 caracteres.':'';return}el.musicSearchStatus.textContent='Buscando canciones…';musicSearchTimer=setTimeout(()=>searchMusic(q),280)}
function searchMusic(query){const seq=++musicSearchSeq,callback=`itunesCallback_${Date.now()}_${seq}`,script=document.createElement('script'),timeout=setTimeout(()=>finish('La búsqueda tardó demasiado. Intenta nuevamente.'),8000);function cleanup(){clearTimeout(timeout);delete window[callback];script.remove()}function finish(error,data){if(seq!==musicSearchSeq){cleanup();return}cleanup();if(error){el.musicSearchStatus.textContent=error;el.musicResults.hidden=true;return}renderMusicResults(data.results||[])}window[callback]=data=>finish(null,data);script.onerror=()=>finish('No fue posible consultar el catálogo musical.');script.src=`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=CL&media=music&entity=song&limit=8&lang=en_us&callback=${encodeURIComponent(callback)}`;document.body.appendChild(script)}
function renderMusicResults(items){const unique=[],seen=new Set();for(const x of items){const key=`${x.trackName}|${x.artistName}`.toLowerCase();if(!seen.has(key)){seen.add(key);unique.push(x)}}el.musicSearchStatus.textContent=unique.length?'Selecciona la canción correcta:':'No encontramos resultados. Puedes escribirla manualmente.';el.musicResults.hidden=!unique.length;el.musicResults.innerHTML=unique.slice(0,6).map((x,i)=>`<button type="button" class="music-result" data-music-result="${i}"><img class="music-cover" src="${esc((x.artworkUrl100||'').replace('100x100','200x200'))}" alt=""><span class="music-copy"><b>${esc(x.trackName)}</b><span>${esc(x.artistName)}${x.collectionName?' · '+esc(x.collectionName):''}</span></span><span class="music-add">＋</span></button>`).join('');el.musicResults.querySelectorAll('[data-music-result]').forEach((b,i)=>b.onclick=()=>selectMusic(unique[i]))}
function selectMusic(x){clearTimeout(musicSearchTimer);musicSearchSeq++;el.musicResults.innerHTML='';el.musicResults.hidden=true;el.musicSearch.value='';el.clearMusicSearch.hidden=true;saveRecentSearch(x.trackName,x.artistName);selectedMusic={title:x.trackName,artist:x.artistName,artwork_url:(x.artworkUrl100||'').replace('100x100','300x300'),external_track_id:String(x.trackId||''),source:'itunes',external_url:x.trackViewUrl||''};manualSongMode=false;el.manualSongFields.hidden=true;el.selectedMusic.hidden=false;el.selectedMusic.innerHTML=`<img class="music-cover" src="${esc(selectedMusic.artwork_url)}" alt=""><span class="music-copy"><b>${esc(selectedMusic.title)}</b><span>${esc(selectedMusic.artist)}</span></span><button type="button" class="remove-music" aria-label="Quitar selección">×</button>`;el.selectedMusic.querySelector('button').onclick=clearSelectedMusic;el.musicResults.hidden=true;el.musicSearchStatus.textContent='Canción seleccionada ✓';el.musicSearch.value='';el.clearMusicSearch.hidden=true}
function clearSelectedMusic(){selectedMusic=null;el.selectedMusic.hidden=true;el.musicSearchStatus.textContent='';el.musicSearch.focus()}
function toggleManualSong(){manualSongMode=!manualSongMode;if(manualSongMode)clearSelectedMusic();el.manualSongFields.hidden=!manualSongMode;el.manualSongToggle.textContent=manualSongMode?'🔎 Volver al buscador musical':'✍️ No encuentro la canción, escribir manualmente';if(manualSongMode)el.title.focus();else el.musicSearch.focus()}
function mySongsStorageKey(){return `pide_tu_tema_my_songs:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}`}
function getMySongIds(){try{const value=JSON.parse(localStorage.getItem(mySongsStorageKey())||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]}catch{return[]}}
function saveMySongId(id){if(!id)return;const ids=getMySongIds();if(!ids.includes(id)){ids.push(id);localStorage.setItem(mySongsStorageKey(),JSON.stringify(ids.slice(-50)))}}
function renderMySongs(){if(!el.mySongsCard)return;const ids=getMySongIds(),idSet=new Set(ids),mine=rows.filter(x=>idSet.has(x.id)).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));el.mySongsCard.hidden=!mine.length;el.mySongsCount.textContent=mine.length;if(!mine.length){el.mySongs.innerHTML='';return}const statusIcon={pending:'⏳',accepted:'✅',next:'🔥',playing:'🔊',played:'🎉'};el.mySongs.innerHTML=mine.map((x,i)=>{const visual=x.artwork_url?`<img class="song-cover" src="${esc(x.artwork_url)}" alt="">`:`<div class="rank">${i+1}</div>`;return `<article class="song my-song ${x.status==='playing'?'playing':''}">${visual}<div class="song-info"><span class="my-marker">PEDIDA POR TI</span><b>${esc(x.title)}</b><div class="meta">${esc(x.artist||'Artista por confirmar')} · ♥ ${x.votes}</div><span class="my-song-status ${esc(x.status)}">${statusIcon[x.status]||'🎵'} ${labels[x.status]||x.status}</span></div></article>`}).join('')}
function showGuest(){el.guest.hidden=false;el.dj.hidden=true;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view==='guest'))}
async function openDj(){if(!configured){el.loginNotice.textContent='Completa config.js.';el.loginModal.hidden=false;return}const {data}=await db.auth.getSession();session=data.session;if(!session){el.loginModal.hidden=false;setTimeout(()=>el.loginEmail.focus(),50);return}el.guest.hidden=true;el.dj.hidden=false;el.loginModal.hidden=true;unseen=0;updateBadge();document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===el.djNav));el.djIdentity.innerHTML=`<span>Sesión: ${esc(session.user.email)}</span><button class="logout" id="logoutBtn">Salir</button>`;$('logoutBtn').onclick=logout;await load();await loadOwnedEvents();await loadMyDjAd();await loadEventCleanupStats();renderEventManager()}
async function logout(){await db?.auth.signOut();session=null;showGuest();el.djIdentity.textContent=''}
const eventThemes={neon:{label:'🎧 Neon DJ',primary:'#8b5cf6',secondary:'#ec4899',accent:'#22d3ee'},elegance:{label:'🥂 Elegance',primary:'#d4af37',secondary:'#111827',accent:'#f8fafc'},tropical:{label:'🌴 Tropical',primary:'#10b981',secondary:'#f97316',accent:'#facc15'},retro:{label:'🪩 Retro 80s',primary:'#f43f5e',secondary:'#7c3aed',accent:'#06b6d4'},custom:{label:'🎨 Personalizado',primary:'#8b5cf6',secondary:'#ec4899',accent:'#22d3ee'}};
function themeForEvent(e=currentEvent){const key=e?.theme_key&&eventThemes[e.theme_key]?e.theme_key:'neon',base=eventThemes[key];return{key,primary:e?.color_primary||base.primary,secondary:e?.color_secondary||base.secondary,accent:e?.color_accent||base.accent,displayName:e?.display_name||e?.name||'Pide Tu Tema'}}
function normalizeLayoutMode(value){return['auto','mobile','desktop'].includes(value)?value:'auto'}
function applyGuestLayout(e=currentEvent){const mode=normalizeLayoutMode(e?.layout_mode);document.body.classList.remove('layout-auto','layout-mobile','layout-desktop');document.body.classList.add(`layout-${mode}`)}
function renderLayoutChoices(){if(!el.layoutChoices)return;el.layoutChoices.querySelectorAll('[data-layout]').forEach(b=>b.classList.toggle('active',b.dataset.layout===selectedLayoutMode));if(el.layoutPreviewText)el.layoutPreviewText.textContent=selectedLayoutMode==='mobile'?'📱 Una columna · controles táctiles · ranking compacto':selectedLayoutMode==='desktop'?'💻 Dos columnas · buscador + ranking · menos scroll':'✨ Se adapta: Celular < 768 px · Notebook ≥ 1200 px'}
function applyEventTheme(e=currentEvent){const t=themeForEvent(e),root=document.body.style;root.setProperty('--event-primary',t.primary);root.setProperty('--event-secondary',t.secondary);root.setProperty('--event-accent',t.accent);document.body.classList.add('event-themed');if(el.eventName)el.eventName.textContent=t.displayName.toUpperCase()+' ✨';if(el.screenEventName)el.screenEventName.textContent=t.displayName;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',t.primary);applyGuestLayout(e)}
function renderThemeChoices(){el.themeChoices.innerHTML=Object.entries(eventThemes).map(([key,t])=>`<button type="button" class="theme-choice ${key===selectedThemeKey?'active':''}" data-theme="${key}"><span class="theme-swatches"><i style="background:${t.primary}"></i><i style="background:${t.secondary}"></i><i style="background:${t.accent}"></i></span><b>${t.label}</b></button>`).join('');el.themeChoices.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{selectedThemeKey=b.dataset.theme;const t=eventThemes[selectedThemeKey];if(selectedThemeKey!=='custom'){el.themePrimary.value=t.primary;el.themeSecondary.value=t.secondary;el.themeAccent.value=t.accent}el.customColors.hidden=selectedThemeKey!=='custom';renderThemeChoices();renderThemePreview()})}
function renderThemePreview(){const t=selectedThemeKey==='custom'?{primary:el.themePrimary.value,secondary:el.themeSecondary.value,accent:el.themeAccent.value}:eventThemes[selectedThemeKey];el.themePreview.style.setProperty('--preview-primary',t.primary);el.themePreview.style.setProperty('--preview-secondary',t.secondary);el.themePreview.style.setProperty('--preview-accent',t.accent);el.themePreviewName.textContent=el.eventDisplayName.value.trim()||currentEvent?.name||'Pide Tu Tema'}
function openThemeEditor(){if(!currentEvent)return;const t=themeForEvent();selectedThemeKey=t.key;selectedLayoutMode=normalizeLayoutMode(currentEvent.layout_mode);el.eventDisplayName.value=t.displayName;el.themePrimary.value=t.primary;el.themeSecondary.value=t.secondary;el.themeAccent.value=t.accent;el.customColors.hidden=selectedThemeKey!=='custom';el.eventThemeForm.hidden=false;renderThemeChoices();renderLayoutChoices();renderThemePreview()}
async function saveEventTheme(e){e.preventDefault();if(!session||!currentEvent)return;const base=selectedThemeKey==='custom'?{primary:el.themePrimary.value,secondary:el.themeSecondary.value,accent:el.themeAccent.value}:eventThemes[selectedThemeKey],display=el.eventDisplayName.value.trim()||currentEvent.name;el.themeNotice.textContent='Guardando diseño…';const {error}=await db.from('events').update({display_name:display,theme_key:selectedThemeKey,color_primary:base.primary,color_secondary:base.secondary,color_accent:base.accent,layout_mode:selectedLayoutMode}).eq('id',currentEvent.id);if(error){el.themeNotice.textContent=error.message;return}Object.assign(currentEvent,{display_name:display,theme_key:selectedThemeKey,color_primary:base.primary,color_secondary:base.secondary,color_accent:base.accent,layout_mode:selectedLayoutMode});const owned=ownedEvents.find(x=>x.id===currentEvent.id);if(owned)Object.assign(owned,currentEvent);applyEventTheme();renderEventManager();renderScreenMode();el.themeNotice.textContent='✓ Diseño guardado';toast('🎨 Diseño actualizado',display,'success')}
function requestedEventSlug(){return new URLSearchParams(location.search).get('evento')||null}
function renderQr(target,url,size=240){if(!target||typeof QRCode==='undefined'){toast('QR no disponible','No se pudo cargar la librería QR','error');return}target.innerHTML='';new QRCode(target,{text:url,width:size,height:size,colorDark:'#090414',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}
function openEventQr(){if(!currentEvent)return;const url=publicEventUrl();el.eventQrName.textContent=currentEvent.name;el.eventQrUrl.textContent=url;el.eventQrModal.hidden=false;renderQr(el.eventQrCanvas,url,240)}
function closeEventQr(){el.eventQrModal.hidden=true}
function downloadEventQr(){const canvas=el.eventQrCanvas.querySelector('canvas'),img=el.eventQrCanvas.querySelector('img'),a=document.createElement('a');a.download=`qr-${currentEvent?.slug||'evento'}.png`;a.href=canvas&&canvas.toDataURL?canvas.toDataURL('image/png'):img?.src||'';if(a.href)a.click()}
function renderScreenQr(){if(!el.screenQr||!currentEvent)return;renderQr(el.screenQr,publicEventUrl(),180)}
function publicEventUrl(event=currentEvent){const u=new URL(location.origin+location.pathname);if(event?.slug)u.searchParams.set('evento',event.slug);return u.toString()}
function screenEventUrl(event=currentEvent){const u=new URL(publicEventUrl(event));u.searchParams.set('modo','pantalla');return u.toString()}

// V5.36 ENTRADA Y PUBLICIDAD
let djAdState=null,partyAdCycles=0;
async function showPublicEventLanding(){const {data,error}=await db.rpc('get_public_events_v536');if(error){setNotice('No se pudieron cargar los eventos.',true);return false}const list=data||[];el.publicEventLanding.hidden=false;document.querySelector('.shell')?.setAttribute('hidden','');el.publicEventList.innerHTML=list.length?list.map(x=>`<article class="public-event-card"><div><span>${x.is_today?'🔥 HOY':'🎉 EVENTO'}</span><h2>${esc(x.display_name)}</h2><small>${x.event_date?new Date(x.event_date).toLocaleString('es-CL',{dateStyle:'medium',timeStyle:'short'}):'Disponible ahora'}</small></div><button type="button" data-public-event="${esc(x.slug)}">ENTRAR A LA FIESTA</button></article>`).join(''):'<div class="summary-empty">No hay eventos activos disponibles.</div>';el.publicEventList.querySelectorAll('[data-public-event]').forEach(b=>b.onclick=()=>{const u=new URL(location.href);u.searchParams.set('evento',b.dataset.publicEvent);location.href=u.toString()});return true}
function djAdDestination(p=djAdState){if(!p)return null;if(p.whatsapp){const digits=String(p.whatsapp).replace(/\D/g,'');return `https://wa.me/${digits}?text=${encodeURIComponent('Hola '+(p.display_name||'Luis DJ')+', vi Pide Tu Tema en un evento y quiero cotizar servicio de DJ.')}`}if(p.instagram)return `https://instagram.com/${String(p.instagram).replace(/^@/,'')}`;if(p.email)return `mailto:${p.email}`;return null}
function renderDjAdPreview(){if(!el.djAdPreview)return;const p={display_name:el.djAdName.value||'Luis DJ',headline:el.djAdHeadline.value||'¿Necesitas DJ para tu evento?',message:el.djAdMessage.value||'Hagamos bailar a todos 🔥',whatsapp:el.djAdWhatsapp.value,instagram:el.djAdInstagram.value,cta_text:el.djAdCta.value||'Cotiza tu evento'};el.djAdPreview.innerHTML=`<span>🎧</span><small>VISTA PREVIA</small><h3>${esc(p.headline)}</h3><b>${esc(p.display_name)}</b><p>${esc(p.message)}</p><em>${esc(p.whatsapp||p.instagram||p.cta_text)}</em>`}
async function loadMyDjAd(){if(!session||!el.djPublicityPanel)return;const {data,error}=await db.rpc('get_my_dj_public_profile_v536');if(error)return;const p=data||{};el.djAdName.value=p.display_name||'Luis DJ';el.djAdHeadline.value=p.headline||'¿Necesitas DJ para tu evento?';el.djAdMessage.value=p.message||'Hagamos bailar a todos 🔥';el.djAdWhatsapp.value=p.whatsapp||'';el.djAdInstagram.value=p.instagram||'';el.djAdTiktok.value=p.tiktok||'';el.djAdEmail.value=p.email||'';el.djAdCta.value=p.cta_text||'Cotiza tu evento';el.djAdEnabled.checked=p.is_ad_enabled!==false;el.djAdFrequency.value=String(p.ad_frequency||2);renderDjAdPreview()}
async function saveDjAd(){const {error}=await db.rpc('save_dj_public_profile_v536',{p_display_name:el.djAdName.value,p_headline:el.djAdHeadline.value,p_message:el.djAdMessage.value,p_whatsapp:el.djAdWhatsapp.value,p_instagram:el.djAdInstagram.value,p_tiktok:el.djAdTiktok.value,p_email:el.djAdEmail.value,p_cta_text:el.djAdCta.value,p_is_ad_enabled:el.djAdEnabled.checked,p_ad_frequency:Number(el.djAdFrequency.value)||2});if(error){el.djAdNotice.textContent=error.message;return}el.djAdNotice.textContent='✅ Publicidad guardada';toast('📢 Publicidad actualizada','Se aplicará en Pantalla Fiesta','success');await loadDjAd()}
async function loadDjAd(){if(!db||!eventId)return;const {data}=await db.rpc('get_dj_public_profile_v536',{p_event_id:eventId});djAdState=data||null}
function renderScreenDjAd(){const p=djAdState;if(!p||!el.screenDjAd)return false;el.screenDjAdHeadline.textContent=p.headline||'¿Necesitas DJ para tu evento?';el.screenDjAdName.textContent=p.display_name||'Luis DJ';el.screenDjAdMessage.textContent=p.message||'Hagamos bailar a todos 🔥';const dest=djAdDestination(p);el.screenDjAdQr.innerHTML='';if(dest)renderQr(el.screenDjAdQr,dest,260);el.screenDjAdContact.textContent=p.whatsapp?`📱 ${p.whatsapp}`:p.instagram?`📸 ${p.instagram}`:p.email?`✉️ ${p.email}`:'';el.screenDjAdCta.textContent=p.cta_text||'Cotiza tu evento';return true}
function showScreenDjAd(){if(!screenModeActive||!djAdState?.is_ad_enabled||projectionActive())return false;if(!renderScreenDjAd())return false;el.screenDjAd.hidden=false;clearInterval(partyScreen.timer);partyScreen.timer=null;setTimeout(()=>{el.screenDjAd.hidden=true;if(screenModeActive&&partyScreen.auto&&!projectionActive()){partyAdvance(1)}},12000);return true}
async function load(){if(!db){setNotice('Falta configurar Supabase.',true);return}const slug=requestedEventSlug();if(!slug){await showPublicEventLanding();return}const {data:e,error}=await db.from('events').select('id,name,slug,event_date,is_active,featured_request_id,owner_id,display_name,theme_key,color_primary,color_secondary,color_accent,layout_mode').eq('slug',slug).maybeSingle();if(error||!e){setNotice('Evento no disponible.',true);return}if(!e.is_active){const {data:s}=await db.auth.getSession();if(!s.session||s.session.user.id!==e.owner_id){setNotice('Este evento está pausado.',true);return}}currentEvent=e;
eventId=e.id;
startDedicationPartyScreenSync();projectorState.featured_request_id=e.featured_request_id||null;await loadDjAd();applyEventTheme(e);renderGuestIdentity();await registerEventVisit();await refreshRows();if(!session&&Notification.permission==='granted')pushHealthCheck(true);await loadMyActivity();await loadGuestGame();if(channel)await db.removeChannel(channel);channel=db.channel(`event:${eventId}:live`).on('postgres_changes',{event:'*',schema:'public',table:'song_requests',filter:`event_id=eq.${eventId}`},handleRealtime).on('postgres_changes',{event:'UPDATE',schema:'public',table:'events',filter:`id=eq.${eventId}`},handleEventRealtime).on('postgres_changes',{event:'INSERT',schema:'public',table:'event_announcements'},()=>loadAnnouncements()).on('postgres_changes',{event:'*',schema:'public',table:'party_social_rounds'},()=>loadSocialExperience()).on('postgres_changes',{event:'*',schema:'public',table:'party_social_entries'},()=>loadSocialExperience()).on('postgres_changes',{event:'*',schema:'public',table:'music_dedications'},()=>loadMusicDedications()).on('postgres_changes',{event:'UPDATE',schema:'public',table:'karaoke_entries'},payload=>{loadKaraokeState();if(payload.new?.status==='called'&&!payload.new?.acknowledged_at)showKaraokeCallAlert(payload.new)}).on('postgres_changes',{event:'*',schema:'public',table:'karaoke_ratings'},()=>loadKaraokeState()).subscribe(status=>{if(status==='SUBSCRIBED')setConnection(true,'Conectado en vivo');if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))setConnection(false,'Reconectando…')});startCoreRealtimeFallback();if(session)await loadOwnedEvents();renderEventManager();await loadVisitorAnalytics();await loadSmartRanking();await loadGameLeaderboard();await loadPartyFinalState();await syncProjectedPhoto();await syncProjectedGreeting();await syncProjectedKaraoke();await loadKaraokeState();await loadMusicDedications();renderNotificationCenter()}
const EVENT_CLEANUP_MODULES=[['requests','🎵','Peticiones'],['votes','❤️','Votos'],['reactions','🔥','Reacciones'],['photos','📸','Fotografías'],['greetings','💌','Saludos'],['dedications','💞','Dedicatorias'],['karaoke','🎤','Karaoke'],['games','🎮','Party Games'],['announcements','📣','Avisos'],['push','📲','Push subscriptions'],['analytics','👥','Analytics'],['star','👑','Momento Estrella'],['thermometer','🔥','Termómetro de la Fiesta']];
function formatCleanupBytes(n){const x=Number(n)||0;return x<1024?`${x} B`:x<1048576?`${(x/1024).toFixed(1)} KB`:`${(x/1048576).toFixed(1)} MB`}
async function invokeEventCleanup(action){const {data:s,error:se}=await db.auth.getSession(),token=s?.session?.access_token;if(se||!token)throw new Error('Sesión DJ no disponible');const {data,error}=await db.functions.invoke('manage-event-data',{headers:{Authorization:`Bearer ${token}`},body:{event_id:eventId,action}});if(error||!data?.ok)throw new Error(data?.error||error?.message||'Error gestionando datos');return data}
async function loadEventCleanupStats(){if(!session||!eventId||!el.eventCleanupCenter)return;el.eventCleanupNotice.textContent='Calculando datos del evento…';try{const d=await invokeEventCleanup('stats'),s=d.stats||{};el.eventCleanupTitle.textContent=d.event_name||currentEvent?.name||'Evento actual';el.cleanupTotalRows.textContent=Number(s.total_rows)||0;el.cleanupPhotoBytes.textContent=formatCleanupBytes(s.photo_bytes);el.eventCleanupKpis.innerHTML=EVENT_CLEANUP_MODULES.map(([k,ico,label])=>`<article><span>${ico}</span><b>${Number(s[k])||0}</b><small>${label}</small></article>`).join('');el.cleanupModules.innerHTML=EVENT_CLEANUP_MODULES.map(([k,ico,label])=>`<div class="cleanup-module"><span>${ico} <b>${label}</b><small>${k==='photos'?formatCleanupBytes(s.photo_bytes):`${Number(s[k])||0} registros`}</small></span><button type="button" data-cleanup-module="${k}" ${(Number(s[k])||0)?'':'disabled'}>🗑️ LIMPIAR</button></div>`).join('');el.eventCleanupNotice.textContent=''}catch(e){el.eventCleanupNotice.textContent=e.message}}
async function cleanupEventModule(key){const m=EVENT_CLEANUP_MODULES.find(x=>x[0]===key);if(!m)return;if(!confirm(`¿Limpiar ${m[2]} de este evento?\n\nEsta acción es permanente.`))return;el.eventCleanupNotice.textContent=`Limpiando ${m[2]}…`;try{const d=await invokeEventCleanup(`cleanup_${key}`);el.eventCleanupNotice.textContent=`✅ ${d.deleted_rows||0} registro(s) eliminados${d.freed_bytes?` · ${formatCleanupBytes(d.freed_bytes)} liberados`:''}`;toast('🧹 Limpieza completada',m[2],'success');await loadEventCleanupStats()}catch(e){el.eventCleanupNotice.textContent=e.message}}
async function cleanupWholeEvent(){const first=confirm('⚠️ LIMPIEZA COMPLETA\n\nSe eliminarán TODOS los datos operacionales de esta fiesta.\n\nEl evento y su configuración se conservarán.\n\n¿Continuar?');if(!first)return;const typed=prompt('Escribe ELIMINAR para confirmar:','');if(typed!=='ELIMINAR'){el.eventCleanupNotice.textContent='Cancelado. Debes escribir ELIMINAR exactamente.';return}el.cleanupAllEvent.disabled=true;el.eventCleanupNotice.textContent='Creando resumen histórico y limpiando evento…';try{const d=await invokeEventCleanup('cleanup_all');el.eventCleanupNotice.textContent=`✅ Evento limpiado: ${d.deleted_rows||0} registros · ${formatCleanupBytes(d.freed_bytes)} liberados`;toast('🏁 Evento limpiado','Resumen histórico conservado','success');await loadEventCleanupStats()}catch(e){el.eventCleanupNotice.textContent=e.message}finally{el.cleanupAllEvent.disabled=false}}
async function loadOwnedEvents(){if(!session)return;const {data,error}=await db.from('events').select('id,name,slug,event_date,is_active,featured_request_id,owner_id,created_at,display_name,theme_key,color_primary,color_secondary,color_accent,layout_mode').eq('owner_id',session.user.id).order('event_date',{ascending:false});if(error){toast('No se pudieron cargar tus eventos',error.message,'error');return}ownedEvents=data||[];renderEventManager()}
function renderEventManager(){if(!el.eventSelector)return;const list=ownedEvents.length?ownedEvents:(currentEvent?[currentEvent]:[]);el.eventSelector.innerHTML=list.map(e=>`<option value="${esc(e.slug)}" ${currentEvent&&e.id===currentEvent.id?'selected':''}>${esc(e.display_name||e.name)}${e.is_active?'':' · Pausado'}</option>`).join('');if(!currentEvent){el.eventManagerMeta.innerHTML='';return}const when=currentEvent.event_date?new Date(currentEvent.event_date).toLocaleString('es-CL',{dateStyle:'medium',timeStyle:'short'}):'Sin fecha';el.eventManagerMeta.innerHTML=`<span class="event-meta-pill ${currentEvent.is_active?'active':'paused'}">${currentEvent.is_active?'● Activo':'⏸ Pausado'}</span><span class="event-meta-pill">📅 ${esc(when)}</span><span class="event-meta-pill">🔗 ${esc(currentEvent.slug)}</span>`;el.toggleEventActive.textContent=currentEvent.is_active?'⏸ Pausar evento':'▶ Activar evento'}
function slugifyEventName(name){return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)}
async function switchEvent(slug){if(!slug||slug===currentEvent?.slug)return;const u=new URL(location.href);u.searchParams.set('evento',slug);u.searchParams.delete('modo');u.searchParams.set('panel','dj');location.href=u.toString()}
async function createEvent(e){e.preventDefault();if(!session)return;const name=el.newEventName.value.trim();if(!name)return;el.newEventNotice.textContent='Creando evento…';const {data,error}=await db.rpc('create_event_v41',{p_name:name,p_event_date:el.newEventDate.value?new Date(el.newEventDate.value).toISOString():null});if(error){el.newEventNotice.textContent=error.message;return}el.newEventForm.reset();el.newEventForm.hidden=true;el.newEventNotice.textContent='';await loadOwnedEvents();toast('🎉 Evento creado','Abriendo el nuevo evento','success');switchEvent(data)}
async function toggleCurrentEvent(){if(!session||!currentEvent)return;const {error}=await db.from('events').update({is_active:!currentEvent.is_active}).eq('id',currentEvent.id);if(error){toast('No se pudo cambiar el evento',error.message,'error');return}currentEvent.is_active=!currentEvent.is_active;await loadOwnedEvents();renderEventManager();toast(currentEvent.is_active?'▶ Evento activado':'⏸ Evento pausado',currentEvent.name,'success')}

function isMySong(id){return getMySongIds().includes(id)}
function mySongAlertKey(id,status){return `pide_tu_tema_song_alert:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}:${id}:${status}`}
function wasSongAlerted(id,status){return localStorage.getItem(mySongAlertKey(id,status))==='1'}
function markSongAlerted(id,status){localStorage.setItem(mySongAlertKey(id,status),'1')}
function notifyMySongStatus(song){if(!song||!isMySong(song.id)||!['next','playing'].includes(song.status)||wasSongAlerted(song.id,song.status))return;markSongAlerted(song.id,song.status);if(song.status==='next'){addPartyNotification('next','Tu canción viene pronto',`${song.title}${song.artist?' · '+song.artist:''}`);haptic('next');beep();toast('🔥 ¡Prepárate!',`Tu canción viene pronto: ${song.title}${song.artist?' · '+song.artist:''}`,'song-alert');browserNotify('🔥 ¡Tu canción viene pronto!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A la pista!`)}else{addPartyNotification('playing','Está sonando tu canción',`${song.title}${song.artist?' · '+song.artist:''}`);haptic('playing');beep();setTimeout(beep,180);toast('🔊 ¡Está sonando tu canción!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A bailar!`,'song-playing');browserNotify('🔊 ¡Está sonando tu canción!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A bailar!`)}}
// CORE_REALTIME_FALLBACK_V5464
let coreRealtimeFallbackTimer=null;
let coreRealtimeFallbackBusy=false;
let coreRealtimeRowsSignature='';
let coreRealtimeSocialSignature='';

function coreRowsSignature(list){
  return (list||[])
    .map(x=>[
      x.id,
      x.status,
      Number(x.votes)||0,
      x.title,
      x.artist||''
    ].join(':'))
    .join('|');
}

function coreSocialSignature(data){
  return JSON.stringify({
    rounds:(data?.rounds||[]).map(x=>[
      x.id,
      x.kind,
      x.title,
      x.created_at
    ]),
    stats:data?.stats||[]
  });
}

async function syncCoreRealtimeFallback(force=false){

  if(
    !db ||
    !eventId ||
    document.hidden ||
    coreRealtimeFallbackBusy
  ){
    return;
  }

  coreRealtimeFallbackBusy=true;

  try{

    /*
     * Actualización liviana de canciones.
     * Evitamos refreshRows(), porque además carga
     * Analytics, avisos, reacciones y otros módulos.
     */
    const {
      data:songData,
      error:songError
    }=await db
      .from('song_requests')
      .select(
        'id,title,artist,requester_name,message,' +
        'votes,status,created_at,artwork_url,' +
        'external_track_id,source,external_url'
      )
      .eq('event_id',eventId)
      .neq('status','rejected')
      .order('votes',{ascending:false})
      .order('created_at',{ascending:true});

    if(!songError){

      const nextRows=songData||[];
      const signature=coreRowsSignature(nextRows);

      if(
        force ||
        signature!==coreRealtimeRowsSignature
      ){
        coreRealtimeRowsSignature=signature;
        rows=nextRows;
        initialized=true;

        render();
        updateMobileMiniPlayer();
        updateContextualSheet();

        /*
         * Actualiza:
         * 🔊 Sonando ahora
         * Top 3
         * Carrusel de Pantalla Fiesta
         */
        if(screenModeActive){
          renderScreenMode();
          renderPartyScene();
        }
      }
    }else{
      console.warn(
        'V5.46.4 respaldo canciones:',
        songError.message
      );
    }

    /*
     * Actualización de Lo que pide la fiesta.
     */
    const {
      data:socialData,
      error:socialError
    }=await db.rpc(
      'get_social_experience_v530',
      {
        p_event_id:eventId,
        p_visitor_id:visitorToken
      }
    );

    if(!socialError){

      const nextSocial=
        socialData||{
          rounds:[],
          stats:[]
        };

      const signature=
        coreSocialSignature(nextSocial);

      if(
        force ||
        signature!==coreRealtimeSocialSignature
      ){
        coreRealtimeSocialSignature=signature;
        socialState=nextSocial;

        renderSocialGuest();
        renderSocialAdmin();
        refreshMyPartyHub();

        if(session){
          await loadPartyPhotos();
          await loadPartyGreetings();
        }
      }

    }else{
      console.warn(
        'V5.46.4 respaldo experiencia social:',
        socialError.message
      );
    }

  }finally{
    coreRealtimeFallbackBusy=false;
  }
}

function startCoreRealtimeFallback(){

  if(coreRealtimeFallbackTimer){
    return;
  }

  syncCoreRealtimeFallback(true);

  coreRealtimeFallbackTimer=setInterval(()=>{

    if(!document.hidden){
      syncCoreRealtimeFallback();
    }

  },5000);
}

function stopCoreRealtimeFallback(){

  if(coreRealtimeFallbackTimer){
    clearInterval(coreRealtimeFallbackTimer);
  }

  coreRealtimeFallbackTimer=null;
  coreRealtimeFallbackBusy=false;
}

async function handleRealtime(payload){if(payload.eventType==='INSERT'&&initialized){const x=payload.new;beep();toast('🎵 Nueva canción',`${x.title}${x.artist?' · '+x.artist:''}`,'success');browserNotify('Nueva canción solicitada',`${x.title}${x.requester_name?' · '+x.requester_name:''}`);if(session&&el.dj.hidden){unseen++;updateBadge()}}if(payload.eventType==='UPDATE'&&payload.new.status==='playing'&&payload.old.status!=='playing'){partyShowNow();toast('🔊 Ahora suena',`${payload.new.title}${payload.new.artist?' · '+payload.new.artist:''}`,'success')}if(payload.eventType==='UPDATE'&&payload.old.status!==payload.new.status)notifyMySongStatus(payload.new);await refreshRows();await loadMyActivity();await loadGuestGame();await loadSmartRanking();await loadGameLeaderboard()}
async function refreshRows(){if(!db||!eventId)return;const {data,error}=await db.from('song_requests').select('id,title,artist,requester_name,message,votes,status,created_at,artwork_url,external_track_id,source,external_url').eq('event_id',eventId).neq('status','rejected').order('votes',{ascending:false}).order('created_at',{ascending:true});if(error){setNotice('No se pudieron cargar los pedidos.',true);setConnection(false,'Sin conexión');return}rows=data||[];initialized=true;render();renderQuickMusicStart();updateMobileMiniPlayer();updateContextualSheet();await loadLiveExperience();await loadReactions();await loadAnnouncements();
await loadSocialExperience();

if(screenModeActive){
  renderScreenMode();
  renderPartyScene();
}
}
function handleEventRealtime(payload){syncProjectedPhoto();syncProjectedGreeting();syncProjectedKaraoke();projectorState.featured_request_id=payload.new.featured_request_id||null;syncDedicationControl();renderScreenMode()}
async function setProjectedDedication(requestId){if(!session||!eventId)return;const {error}=await db.rpc('set_featured_dedication',{p_event_id:eventId,p_request_id:requestId||null});if(error){toast('No se pudo actualizar la pantalla',error.message,'error');return}projectorState.featured_request_id=requestId||null;syncDedicationControl();renderScreenMode();toast(requestId?'💬 Dedicatoria enviada a pantalla':'↩ Pantalla volvió a Sonando ahora','Actualización realizada','success')}
// ===== V5.0.5 PANTALLA FIESTA =====
const partyScreen={scenes:['now','top','active','participation','qr'],index:0,auto:true,timer:null,seconds:12};
function partyCurrentScene(){return partyScreen.scenes[partyScreen.index%partyScreen.scenes.length]}
function partyAdvance(step=1){const prev=partyScreen.index;partyScreen.index=(partyScreen.index+step+partyScreen.scenes.length)%partyScreen.scenes.length;if(step>0&&partyScreen.index===0&&prev!==0){partyAdCycles++;const freq=Number(djAdState?.ad_frequency)||2;if(djAdState?.is_ad_enabled&&partyAdCycles%freq===0&&showScreenDjAd())return}renderPartyScene();partyRestartTimer()}
function partyRestartTimer(){clearInterval(partyScreen.timer);partyScreen.timer=null;if(screenModeActive&&partyScreen.auto)partyScreen.timer=setInterval(()=>partyAdvance(1),partyScreen.seconds*1000);if(el.screenToggleAuto)el.screenToggleAuto.textContent=partyScreen.auto?'⏸ Auto':'▶ Manual'}
function partyArtwork(song){return song?.artwork_url?`<div class="party-artwork"><img src="${esc(song.artwork_url)}" alt=""></div>`:'<div class="party-artwork"><div class="screen-artwork-fallback">🎵</div></div>'}
function partySongRows(list){const medals=['🥇','🥈','🥉'];return list.slice(0,3).map((x,i)=>`<div class="party-list-row"><span class="party-list-rank">${medals[i]}</span><span class="party-list-copy"><b>${esc(x.title)}</b><small>${esc(x.artist||'Artista por confirmar')}</small></span><span class="party-list-value">♥ ${Number(x.votes)||0}</span></div>`).join('')}
async function renderPartyScene(){if(!el.screenScene||!screenModeActive)return;const scene=partyCurrentScene(),playing=currentPlayingSong(),visible=screenVisibleRows();el.screenScene.classList.remove('scene-enter');void el.screenScene.offsetWidth;el.screenScene.classList.add('scene-enter');if(scene==='now'){if(playing)el.screenScene.innerHTML=`<div class="party-scene-inner">${partyArtwork(playing)}<span class="party-kicker">🔊 SONANDO AHORA</span><h2 class="party-title">${esc(playing.title)}</h2><div class="party-subtitle">${esc(playing.artist||'Artista por confirmar')}</div><div class="party-metric">♥ ${Number(playing.votes)||0} votos</div></div>`;else el.screenScene.innerHTML='<div class="party-scene-inner"><span class="party-kicker">🎧 FIESTA EN VIVO</span><h2 class="party-title">La fiesta sigue</h2><div class="party-subtitle">Pide tu canción y vota por tus favoritas</div></div>';return}if(scene==='top'){el.screenScene.innerHTML=`<div class="party-scene-inner"><span class="party-kicker">🔥 TOP DE LA FIESTA</span><h2 class="party-title">Las más votadas</h2><div class="party-list">${visible.length?partySongRows(visible):'<div class="party-subtitle">Esperando las primeras canciones…</div>'}</div></div>`;return}if(scene==='active'){const {data}=await db.rpc('get_game_leaderboard_v504',{p_event_id:eventId});const list=data||[],medals=['🥇','🥈','🥉'];el.screenScene.innerHTML=`<div class="party-scene-inner"><span class="party-kicker">🏆 LOS MÁS ACTIVOS</span><h2 class="party-title">La comunidad de la fiesta</h2><div class="party-list">${list.length?list.slice(0,3).map((x,i)=>`<div class="party-list-row"><span class="party-list-rank">${medals[i]}</span><span class="party-list-copy"><b>${esc(x.display_name)}</b><small>🎵 ${Number(x.requests)||0} · ❤️ ${Number(x.votes)||0} · ▶️ ${Number(x.played)||0}</small></span><span class="party-list-value">${Number(x.points)||0} pts</span></div>`).join(''):'<div class="party-subtitle">La competencia recién comienza…</div>'}</div></div>`;return}if(scene==='participation'){const {data}=await db.rpc('get_event_analytics_v452',{p_event_id:eventId});const d=data||{},vis=Number(d.visitors)||0,eng=Number(d.engaged)||0,rate=vis?Math.min(100,Math.round(eng*100/vis)):0;el.screenScene.innerHTML=`<div class="party-scene-inner"><span class="party-kicker">🎉 LA FIESTA EN VIVO</span><h2 class="party-title">${rate}% participación</h2><div class="party-stats"><div class="party-stat"><b>${vis}</b><small>👥 Visitantes</small></div><div class="party-stat"><b>${Number(d.requests)||0}</b><small>🎵 Pedidos</small></div><div class="party-stat"><b>${Number(d.votes)||0}</b><small>❤️ Votos</small></div><div class="party-stat"><b>${Number(d.played)||0}</b><small>▶️ Reproducidas</small></div></div></div>`;return}if(scene==='qr'){el.screenScene.innerHTML='<div class="party-scene-inner"><div class="party-qr"><div id="partyScreenQr" class="party-qr-code"></div><div class="party-qr-copy"><span class="party-kicker">📱 PARTICIPA AHORA</span><h2>¿Qué quieres escuchar?</h2><p>Escanea · Pide · Vota · Baila 🔥</p></div></div></div>';const q=$('partyScreenQr');if(q)renderQr(q,publicEventUrl(),280)}}
function partyShowNow(){partyScreen.index=partyScreen.scenes.indexOf('now');renderPartyScene();partyRestartTimer()}
function screenVisibleRows(){return rows.filter(x=>x.status!=='played'&&x.status!=='rejected')}
function renderScreenMode(){if(!el.screenMode)return;renderScreenQr();renderPartyScene();const playing=currentPlayingSong(),visible=screenVisibleRows(),featured=projectorState.featured_request_id?rows.find(x=>x.id===projectorState.featured_request_id):null;if(playing){const artwork=playing.artwork_url?`<img src="${esc(playing.artwork_url)}" alt="">`:'<div class="screen-artwork-fallback">🎵</div>';el.screenNow.innerHTML=`<div class="screen-artwork">${artwork}</div><div class="screen-now-copy"><span class="screen-now-label">🔊 SONANDO AHORA</span><h2>${esc(playing.title)}</h2><div class="screen-now-artist">${esc(playing.artist||'Artista por confirmar')}</div>${playing.requester_name?`<div class="screen-now-meta">🎉 Pedida por ${esc(playing.requester_name)}</div>`:''}${playing.message?`<div class="screen-now-message">💬 “${esc(playing.message)}”</div>`:''}</div>`}else{el.screenNow.innerHTML='<div class="screen-idle"><div class="screen-idle-icon">🎧</div><h2>La fiesta sigue</h2><p>Pide tu canción y vota por tus favoritas</p></div>'}el.screenTop3.innerHTML=visible.length?visible.slice(0,3).map((x,i)=>`<div class="screen-rank-row"><span class="screen-medal">${['🥇','🥈','🥉'][i]}</span><span><b>${esc(x.title)}</b><small>${esc(x.artist||'Artista por confirmar')}</small></span><span class="screen-rank-votes">♥ ${x.votes}</span></div>`).join(''):'<div class="summary-empty">Esperando las primeras canciones…</div>';const showFeatured=Boolean(featured&&featured.message&&featured.message.trim());el.screenDedication.hidden=!showFeatured;if(showFeatured){el.screenDedicationArtwork.innerHTML=featured.artwork_url?`<img src="${esc(featured.artwork_url)}" alt="">`:'<div class="screen-artwork-fallback">🎵</div>';el.screenDedicationSong.textContent=`${featured.title} · ${featured.artist||'Artista por confirmar'}`;el.screenDedicationMessage.textContent=`“${featured.message.trim()}”`;el.screenDedicationRequester.textContent=featured.requester_name?`🎉 De ${featured.requester_name}`:'🎉 De un invitado'}}
function startScreenClock(){clearInterval(screenClockTimer);const tick=()=>{el.screenClock.textContent=new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})};tick();screenClockTimer=setInterval(tick,30000)}
function openScreenMode(){screenModeActive=true;el.screenMode.hidden=false;partyRestartTimer();startKaraokeProjectionPolling();startGreetingScreenPolling();startPhotoScreenPolling();document.body.classList.add('screen-active');const u=new URL(location.href);u.searchParams.set('modo','pantalla');history.replaceState({},'',u);startScreenClock();renderScreenMode()}
document.addEventListener('visibilitychange',()=>{
  if(!screenModeActive) return;

  if(document.hidden){
    stopKaraokeProjectionPolling();
    stopPhotoScreenPolling();
    stopCoreRealtimeFallback();
  }else{
    syncProjectedPhoto(true);
    startCoreRealtimeFallback();
    syncCoreRealtimeFallback(true);
    syncProjectedGreeting();
    syncProjectedKaraoke();
    startKaraokeProjectionPolling();
    startPhotoScreenPolling();
  }
});

function closeScreenMode(){screenModeActive=false;stopKaraokeProjectionPolling();stopGreetingScreenPolling();stopPhotoScreenPolling();el.screenMode.hidden=true;document.body.classList.remove('screen-active');clearInterval(screenClockTimer);const u=new URL(location.href);u.searchParams.delete('modo');history.replaceState({},'',u)}
function currentPlayingSong(){return rows.find(x=>x.status==='playing')||null}
function syncDedicationControl(){if(!el.highlightDedication)return;const song=currentPlayingSong(),available=Boolean(session&&song&&song.message&&song.message.trim());el.highlightDedication.disabled=!available;el.highlightDedication.textContent=available?'💬 Destacar dedicatoria':song?'💬 Sin dedicatoria':'💬 Destacar dedicatoria';el.clearProjectedDedication.disabled=!Boolean(session&&projectorState.featured_request_id)}
function showDedicationSpotlight(){const song=currentPlayingSong();if(!song||!song.message||!song.message.trim())return;setProjectedDedication(song.id);el.dedicationMessage.textContent=song.message.trim();el.dedicationRequester.textContent=song.requester_name?`🎉 De ${song.requester_name}`:'🎉 De un invitado';el.dedicationArtist.textContent=song.artist||'Artista por confirmar';document.getElementById('dedicationSpotlightTitle').textContent=song.title;el.dedicationArtwork.innerHTML=song.artwork_url?`<img src="${esc(song.artwork_url)}" alt="">`:'<span>🎵</span>';el.dedicationSpotlight.hidden=false}
function hideDedicationSpotlight(){el.dedicationSpotlight.hidden=true}
function numberOneKey(id){return `pide_tu_tema_number_one:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}:${id}`}
function wasNumberOneCelebrated(id){return localStorage.getItem(numberOneKey(id))==='1'}
function markNumberOneCelebrated(id){localStorage.setItem(numberOneKey(id),'1')}
function hideNumberOneCelebration(){if(el.numberOneCelebration)el.numberOneCelebration.hidden=true;if(el.confettiLayer)el.confettiLayer.innerHTML=''}
function createConfetti(){if(!el.confettiLayer||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const colors=['#fde047','#ec4899','#8b5cf6','#22d3ee','#34d399','#ffffff'];el.confettiLayer.innerHTML=Array.from({length:46},(_,i)=>{const left=Math.random()*100,duration=(2.4+Math.random()*2).toFixed(2),delay=(Math.random()*.7).toFixed(2),drift=`${Math.round((Math.random()-.5)*180)}px`,rotate=`${Math.round(Math.random()*180)}deg`;return `<i class="confetti-piece" style="left:${left}%;background:${colors[i%colors.length]};--duration:${duration}s;--delay:${delay}s;--drift:${drift};--rotate:${rotate}"></i>`}).join('')}
function celebrateNumberOne(song){if(!song||!el.numberOneCelebration||!isMySong(song.id)||wasNumberOneCelebrated(song.id))return;markNumberOneCelebrated(song.id);addPartyNotification('numberOne','¡Llegaste al #1!',song.title);el.numberOneSong.textContent=song.title;el.numberOneArtist.textContent=song.artist||'Artista por confirmar';el.numberOneVotes.textContent=`♥ ${song.votes} voto${song.votes===1?'':'s'}`;el.numberOneArtwork.innerHTML=song.artwork_url?`<img src="${esc(song.artwork_url)}" alt="">`:'<span>🎵</span>';el.numberOneCelebration.hidden=false;createConfetti();haptic('numberOne');beep();setTimeout(beep,170);setTimeout(beep,340);browserNotify('👑 ¡Tu canción llegó al #1!',`${song.title}${song.artist?' · '+song.artist:''} · ${song.votes} votos`)}
function checkNumberOneCelebration(){const visible=rows.filter(x=>x.status!=='played'&&x.status!=='rejected');if(visible.length)celebrateNumberOne(visible[0])}
function competitiveInfo(x,i,list){const pos=i+1;if(pos===1)return{icon:'🥇',className:'top-1',tags:'<span class="competitive-tag king">👑 #1 DE LA FIESTA</span>',gap:'',crown:'<span class="rank-crown">👑</span>'};const prev=list[i-1],needed=Math.max(1,(prev?.votes||0)-x.votes+1);if(pos===2||pos===3)return{icon:pos===2?'🥈':'🥉',className:`top-${pos}`,tags:`<span class="competitive-tag climb">🔥 A ${needed} voto${needed===1?'':'s'} de subir</span>`,gap:`Faltan ${needed} voto${needed===1?'':'s'} para superar el puesto #${pos-1}`,crown:''};return{icon:String(pos),className:'',tags:needed<=3?'<span class="competitive-tag climb">⚡ Cerca de subir</span>':'',gap:`${needed} voto${needed===1?'':'s'} para subir al #${pos-1}`,crown:''}}
function songHTML(x,i,djMode=false,list=rows){const yt=`https://www.youtube.com/results?search_query=${encodeURIComponent(`${x.artist||''} ${x.title} official audio`)}`;const actions=`<div class="actions"><button class="action" data-status="accepted" data-id="${x.id}">Aceptar</button><button class="action" data-status="next" data-id="${x.id}">Próxima</button><button class="action play" data-status="playing" data-id="${x.id}">Sonando</button><button class="action" data-status="played" data-id="${x.id}">Lista</button><a class="youtube" href="${yt}" target="_blank" rel="noopener">▶ YouTube</a><button class="action close" data-status="rejected" data-id="${x.id}">Cerrar</button></div>`;const c=!djMode?competitiveInfo(x,i,list):null;const visual=x.artwork_url?`<img class="song-cover" src="${esc(x.artwork_url)}" alt="">`:`<div class="${djMode?'rank':'podium'}">${djMode?i+1:c.icon}</div>`;const competition=!djMode?`${c.tags}${c.gap?`<span class="vote-gap">${c.gap}</span>`:''}${c.crown}`:'';return `<article class="song ${x.status==='playing'?'playing':''} ${!djMode?'competitive '+c.className:''}">${x.artwork_url&&!djMode?`<div class="podium">${c.icon}</div>`:''}${visual}<div class="song-info"><b>${esc(x.title)}</b><div class="meta">${esc(x.artist||'Artista por confirmar')} · ${esc(x.requester_name||'Invitado')}</div>${x.message?`<div class="meta">💬 ${esc(x.message)}</div>`:''}<span class="state">${labels[x.status]||x.status}</span>${competition}</div>${djMode?actions:`<button class="vote" data-vote="${x.id}">♥ ${x.votes}</button>`}</article>`}
function render(){const visible=rows.filter(x=>x.status!=='played'),empty='<div class="empty">Aún no hay canciones. ¡Sé el primero! 🎶</div>';el.ranking.innerHTML=visible.length?visible.map((x,i)=>songHTML(x,i,false,visible)).join(''):empty;ensureMobileRankingToggle();const playing=rows.find(x=>x.status==='playing');el.nowPlaying.hidden=!playing;el.nowPlaying.innerHTML=playing?`<div class="now-playing-inner"><div class="now-cover-wrap">${playing.artwork_url?`<img class="now-cover" src="${esc(playing.artwork_url)}" alt="">`:'<div class="now-cover-fallback">🎵</div>'}<span class="now-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><div class="now-copy"><span class="now-label"><i class="now-live-dot"></i> Sonando ahora</span><h3 class="now-title">${esc(playing.title)}</h3><div class="now-artist">${esc(playing.artist||'Artista por confirmar')}</div>${playing.requester_name?`<div class="now-requester">🎉 Pedida por ${esc(playing.requester_name)}</div>`:''}${playing.message?`<div class="now-message">💬 “${esc(playing.message)}”</div>`:''}<span class="now-votes">♥ ${playing.votes} voto${playing.votes===1?'':'s'}</span></div></div>`:'';renderDj();el.nRequests.textContent=rows.length;el.nVotes.textContent=rows.reduce((a,x)=>a+x.votes,0);el.nQueue.textContent=rows.filter(x=>['accepted','next','playing'].includes(x.status)).length;renderPartySummary();renderMySongs();renderRecommendations();checkNumberOneCelebration();syncDedicationControl();renderScreenMode()}
function partySummaryData(){const activeRows=rows.filter(x=>x.status!=='rejected');const topSongs=[...activeRows].sort((a,b)=>b.votes-a.votes||new Date(a.created_at)-new Date(b.created_at)).slice(0,5);const artists=new Map(),hours=new Map(),statuses=new Map();for(const x of activeRows){const artist=(x.artist||'Artista por confirmar').trim();artists.set(artist,(artists.get(artist)||0)+1);const d=new Date(x.created_at);if(!Number.isNaN(d.getTime())){const key=d.getHours();hours.set(key,(hours.get(key)||0)+1)}statuses.set(x.status,(statuses.get(x.status)||0)+1)}const topArtist=[...artists.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]||null;const peak=[...hours.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0]||null;return{activeRows,topSongs,topArtist,peak,statuses}}
function renderPartySummary(){if(!el.summaryContent)return;const d=partySummaryData(),winner=d.topSongs[0];el.summaryTopSong.textContent=winner?winner.title:'Sin datos';el.summaryTopSongMeta.textContent=winner?`${winner.artist||'Artista por confirmar'} · ${winner.votes} voto${winner.votes===1?'':'s'}`:'Aún no hay pedidos';el.summaryTopArtist.textContent=d.topArtist?d.topArtist[0]:'Sin datos';el.summaryTopArtistMeta.textContent=d.topArtist?`${d.topArtist[1]} solicitud${d.topArtist[1]===1?'':'es'}`:'0 solicitudes';el.summaryPeakHour.textContent=d.peak?`${String(d.peak[0]).padStart(2,'0')}:00 a ${String((d.peak[0]+1)%24).padStart(2,'0')}:00`:'Sin datos';el.summaryPeakHourMeta.textContent=d.peak?`${d.peak[1]} solicitud${d.peak[1]===1?'':'es'}`:'0 solicitudes';el.summaryTopSongs.innerHTML=d.topSongs.length?d.topSongs.map((x,i)=>`<div class="summary-row"><span class="summary-position">${i+1}</span><span class="summary-label"><b>${esc(x.title)}</b><small>${esc(x.artist||'Artista por confirmar')}</small></span><span class="summary-value">♥ ${x.votes}</span></div>`).join(''):'<div class="summary-empty">Aún no hay canciones para resumir.</div>';const total=Math.max(d.activeRows.length,1),order=['pending','accepted','next','playing','played'];el.summaryStatuses.innerHTML=order.map(status=>{const count=d.statuses.get(status)||0,pct=Math.round(count*100/total);return `<div class="status-summary-row"><span>${labels[status]||status}</span><span class="status-bar"><i style="width:${pct}%"></i></span><b>${count}</b></div>`}).join('');el.summaryUpdated.textContent=`Actualizado ${new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})}`}
function summaryText(){const d=partySummaryData(),winner=d.topSongs[0],lines=['🎧 RESUMEN DE LA FIESTA',`Pedidos: ${d.activeRows.length}`,`Votos: ${d.activeRows.reduce((a,x)=>a+x.votes,0)}`,`Más votada: ${winner?`${winner.title} - ${winner.artist||'Artista por confirmar'} (${winner.votes} votos)`:'Sin datos'}`,`Artista favorito: ${d.topArtist?`${d.topArtist[0]} (${d.topArtist[1]} solicitudes)`:'Sin datos'}`,`Hora más activa: ${d.peak?`${String(d.peak[0]).padStart(2,'0')}:00 (${d.peak[1]} solicitudes)`:'Sin datos'}`,'','TOP CANCIONES'];d.topSongs.forEach((x,i)=>lines.push(`${i+1}. ${x.title} - ${x.artist||'Artista por confirmar'} (${x.votes} votos)`));return lines.join('\n')}
function renderDj(){const q=el.djSearch.value.trim().toLowerCase(),status=el.statusFilter.value;const filtered=rows.filter(x=>(status==='all'||x.status===status)&&[x.title,x.artist,x.requester_name].some(v=>String(v||'').toLowerCase().includes(q)));el.djList.innerHTML=filtered.length?filtered.map((x,i)=>songHTML(x,i,true)).join(''):'<div class="empty">No hay resultados para este filtro.</div>'}
async function vote(id,button){button.disabled=true;const {error}=await db.rpc('vote_song_v52',{p_request_id:id,p_voter_token:voterToken,p_visitor_id:visitorToken});button.disabled=false;if(error){const msg=error.message.includes('duplicate')?'Ya votaste por esta canción. 💜':'No se pudo registrar el voto.';setNotice(msg,true);toast('Aviso',msg,'error')}else{haptic('vote');await trackEngagement('vote',id);await loadMyActivity();await loadGuestGame();setNotice('¡Voto registrado! 💜');toast('Voto registrado','Tu canción sube en el ranking','success');await refreshRows()}}
async function setStatus(id,status){if(!session){el.loginModal.hidden=false;return}const {error}=await db.from('song_requests').update({status}).eq('id',id);if(error)toast('No autorizado','No se pudo modificar el pedido','error');else{toast('Estado actualizado',labels[status]||status,'success');await refreshRows()}}
el.partyNotificationButton.onclick=()=>{el.partyNotificationDrawer.hidden=false;renderNotificationCenter()};el.closeNotificationDrawer.onclick=()=>el.partyNotificationDrawer.hidden=true;el.markNotificationsRead.onclick=()=>{const list=readNotifications().map(x=>({...x,read:true}));writeNotifications(list);renderNotificationCenter()};el.closeAchievementCelebration.onclick=()=>el.achievementCelebration.hidden=true;el.recommendationsList?.addEventListener('click',e=>{const b=e.target.closest('[data-recommend-vote]');if(b)vote(b.dataset.recommendVote,b)});el.downloadMyNight.onclick=()=>{const c=myNightCanvas(),a=document.createElement('a');a.download=`mi-noche-${currentEvent?.slug||'evento'}.png`;a.href=c.toDataURL('image/png');a.click()};el.shareMyNight.onclick=shareMyNightCard;el.closeParty.onclick=async()=>{if(!confirm('¿Cerrar la fiesta? Se bloquearán nuevos pedidos.'))return;const {error}=await db.rpc('close_party_v515',{p_event_id:eventId});if(error){toast('No se pudo cerrar',error.message,'error');return}finalExperience.partyClosed=true;toast('🏁 Fiesta cerrada','Los invitados ya pueden ver Mi Noche','success');await loadPartyFinalState()};
el.reactionButtons?.addEventListener('click',e=>{const b=e.target.closest('[data-reaction]');if(b)sendReaction(b.dataset.reaction)});el.refreshReactions.onclick=loadReactions;
el.closeContextualSheet.onclick=closeContextualSheet;el.contextualGo.onclick=()=>{const t=mobileExperience.sheetTarget;closeContextualSheet();if(t)scrollMobileTarget(t)};el.contextualSheet.addEventListener('touchstart',e=>{el.contextualSheet.dataset.touchY=e.touches[0].clientY},{passive:true});el.contextualSheet.addEventListener('touchend',e=>{const y=Number(el.contextualSheet.dataset.touchY||0);if(e.changedTouches[0].clientY-y>40)closeContextualSheet()},{passive:true});el.recentSearches?.addEventListener('click',e=>{const b=e.target.closest('[data-quick-recent]');if(!b)return;const list=JSON.parse(localStorage.getItem(recentSearchKey())||'[]'),x=list[Number(b.dataset.quickRecent)];if(x){el.musicSearch.value=`${x.title} ${x.artist||''}`.trim();searchMusic(el.musicSearch.value)}});el.popularSearches?.addEventListener('click',e=>{const b=e.target.closest('[data-quick-song]');if(!b)return;const x=rows.find(r=>r.id===b.dataset.quickSong);if(x){el.musicSearch.value=`${x.title} ${x.artist||''}`.trim();searchMusic(el.musicSearch.value)}});
el.karaokeMusicSearch?.addEventListener('input',scheduleKaraokeMusicSearch);el.clearKaraokeMusicSearch?.addEventListener('click',()=>{karaokeState.searchSeq++;clearTimeout(karaokeState.searchTimer);el.karaokeMusicSearch.value='';el.clearKaraokeMusicSearch.hidden=true;el.karaokeMusicResults.hidden=true;el.karaokeMusicSearchStatus.textContent='';el.karaokeMusicSearch.focus()});el.karaokeManualToggle?.addEventListener('click',toggleKaraokeManualSong);document.querySelectorAll('[data-karaoke-nomination]').forEach(b=>b.addEventListener('click',()=>{karaokeState.nomination=b.dataset.karaokeNomination;document.querySelectorAll('[data-karaoke-nomination]').forEach(x=>x.classList.toggle('active',x===b));const prop=karaokeState.nomination==='proposed';el.karaokeProposer.hidden=!prop;el.karaokeConsentWrap.hidden=!prop}));el.submitKaraoke?.addEventListener('click',submitKaraokeEntry);el.karaokeRatingStars?.addEventListener('click',e=>{const b=e.target.closest('[data-karaoke-rating]');if(b)rateKaraoke(b.dataset.karaokeRating)});el.refreshKaraokeGuest?.addEventListener('click',loadKaraokeState);el.refreshKaraokeDj?.addEventListener('click',loadKaraokeState);el.startKaraoke?.addEventListener('click',startKaraokeRound);el.karaokeEntries?.addEventListener('click',e=>{const del=e.target.closest('[data-karaoke-delete]');if(del){deleteKaraokeData('delete_one',del.dataset.karaokeDelete);return}const call=e.target.closest('[data-karaoke-call]');if(call){projectKaraoke(call.dataset.karaokeCall,'call');return}const b=e.target.closest('[data-karaoke-status]');if(b)updateKaraokeEntry(b.dataset.karaokeId,b.dataset.karaokeStatus)});el.projectKaraokeWinner?.addEventListener('click',()=>{if(el.projectKaraokeWinner.dataset.entryId)projectKaraoke(el.projectKaraokeWinner.dataset.entryId,'winner')});el.clearKaraokeScreen?.addEventListener('click',clearProjectedKaraoke);el.refreshKaraokeStats?.addEventListener('click',loadKaraokeStats);el.deleteFinishedKaraoke?.addEventListener('click',()=>deleteKaraokeData('delete_finished'));el.deleteAllKaraoke?.addEventListener('click',()=>deleteKaraokeData('delete_event'));
el.dedicationMusicSearch?.addEventListener('input',scheduleDedicationSearch);el.clearDedicationMusicSearch?.addEventListener('click',()=>{el.dedicationMusicSearch.value='';el.dedicationMusicResults.hidden=true;el.clearDedicationMusicSearch.hidden=true});el.dedicationManualToggle?.addEventListener('click',toggleDedicationManual);el.submitMusicDedication?.addEventListener('click',submitMusicDedication);el.refreshMusicDedications?.addEventListener('click',loadMusicDedications);el.musicDedicationDj?.addEventListener('click',e=>{const b=e.target.closest('[data-dedication-action]');if(b)manageMusicDedication(b.dataset.id,b.dataset.dedicationAction)});el.deleteRejectedDedications?.addEventListener('click',()=>cleanupMusicDedications('rejected'));el.deleteAllDedications?.addEventListener('click',()=>cleanupMusicDedications('all'));document.querySelectorAll('[data-greeting-type]').forEach(b=>b.addEventListener('click',()=>{greetingState.type=b.dataset.greetingType;document.querySelectorAll('[data-greeting-type]').forEach(x=>x.classList.toggle('active',x===b))}));el.sendPartyGreeting?.addEventListener('click',sendPartyGreeting);el.refreshPartyGreetings?.addEventListener('click',async()=>{await loadPartyGreetings();await loadGreetingStats()});el.partyGreetingPending?.addEventListener('click',e=>{const d=e.target.closest('[data-greeting-delete]');if(d){deletePartyGreetings('delete_one',d.dataset.greetingDelete);return}const b=e.target.closest('[data-greeting-moderate]');if(b)moderatePartyGreeting(b.dataset.greetingId,b.dataset.greetingModerate)});el.partyGreetingApproved?.addEventListener('click',e=>{const d=e.target.closest('[data-greeting-delete]');if(d){deletePartyGreetings('delete_one',d.dataset.greetingDelete);return}const p=e.target.closest('[data-greeting-project]');if(p){projectPartyGreeting(p.dataset.greetingProject);return}if(e.target.closest('[data-greeting-clear]'))clearProjectedGreeting()});el.refreshGreetingStats?.addEventListener('click',loadGreetingStats);el.deleteRejectedGreetings?.addEventListener('click',()=>deletePartyGreetings('delete_rejected'));el.deleteAllGreetings?.addEventListener('click',()=>deletePartyGreetings('delete_event'));
el.socialPartyGuestList?.addEventListener('click',e=>{const pick=e.target.closest('[data-party-photo-pick]');if(pick){el.socialPartyGuestList.querySelector(`[data-party-photo-input="${pick.dataset.partyPhotoPick}"]`)?.click()}});el.socialPartyGuestList?.addEventListener('change',async e=>{const input=e.target.closest('[data-party-photo-input]');if(input){await uploadPartyPhoto(input.dataset.partyPhotoInput,input.files?.[0]);input.value=''}});el.partyPhotoQueue?.addEventListener('click',e=>{const d=e.target.closest('[data-delete-photo]');if(d){deletePartyPhotos('delete_one',d.dataset.deletePhoto);return}const b=e.target.closest('[data-photo-moderate]');if(b)moderatePartyPhoto(b.dataset.photoId,b.dataset.photoModerate)});el.partyPhotoApproved?.addEventListener('click',e=>{const d=e.target.closest('[data-delete-photo]');if(d){deletePartyPhotos('delete_one',d.dataset.deletePhoto);return}const b=e.target.closest('[data-project-photo]');if(b){projectPartyPhoto(b.dataset.projectPhoto);return}const c=e.target.closest('[data-clear-photo]');if(c)clearProjectedPartyPhoto()});el.refreshPartyPhotos?.addEventListener('click',async()=>{await loadPartyPhotos();await loadPartyPhotoStats()});el.refreshPartyPhotoStats?.addEventListener('click',loadPartyPhotoStats);el.deleteRejectedPhotos?.addEventListener('click',()=>deletePartyPhotos('delete_rejected'));el.deleteAllEventPhotos?.addEventListener('click',()=>deletePartyPhotos('delete_event'));
el.refreshSocialParty?.addEventListener('click',loadSocialExperience);el.socialPartyDj?.addEventListener('click',async e=>{const start=e.target.closest('[data-social-start]');if(start){await startSocialRound(start.dataset.socialStart);return}const close=e.target.closest('[data-social-close]');if(close){await db.rpc('close_social_round_v530',{p_round_id:close.dataset.socialClose});await loadSocialExperience()}});el.socialPartyGuestList?.addEventListener('click',async e=>{const b=e.target.closest('[data-social-entry]');if(b){await submitSocialEntry(b.dataset.socialRound,b.dataset.socialEntry);return}const s=e.target.closest('[data-social-submit]');if(s){const card=s.closest('.social-round'),table=card.querySelector('[data-social-table]')?.value.trim(),song=card.querySelector('[data-social-song]')?.value.trim();if(!table||!song){toast('Completa mesa y canción','','error');return}await submitSocialEntry(s.dataset.socialSubmit,table,{song})}});
el.showIosPushGuide?.addEventListener('click',openIosPushGuide);el.closeIosPushGuide?.addEventListener('click',closeIosPushGuide);el.closeIosPushGuideAction?.addEventListener('click',closeIosPushGuide);el.iosPushGuide?.addEventListener('click',e=>{if(e.target===el.iosPushGuide)closeIosPushGuide()});
el.enablePartyPush?.addEventListener('click',enablePartyPush);
el.disablePartyPush?.addEventListener('click',disablePartyPush);el.testPartyPush?.addEventListener('click',testPartyPush);el.repairPartyPush?.addEventListener('click',repairPartyPush);
renderPushPlatformUx();
renderAnnouncementTemplates();
el.announcementTemplates?.addEventListener('click',e=>{
  const b=e.target.closest('[data-announcement-template]');
  if(!b)return;
  const x=announcementTemplates[Number(b.dataset.announcementTemplate)];
  if(x && el.announcementMessage)el.announcementMessage.value=x[1];
});
el.sendAnnouncement?.addEventListener('click',sendAnnouncement);
el.refreshAnnouncements?.addEventListener('click',loadAnnouncements);
el.ackAnnouncement?.addEventListener('click',acknowledgeAnnouncement);
el.mobileQuickClose.onclick=closeMobileQuickSheet;el.mobileQuickBackdrop.onclick=closeMobileQuickSheet;el.mobileQuickSheet.addEventListener('touchstart',e=>{el.mobileQuickSheet.dataset.touchY=e.touches[0].clientY},{passive:true});el.mobileQuickSheet.addEventListener('touchend',e=>{const y=Number(el.mobileQuickSheet.dataset.touchY||0);if(e.changedTouches[0].clientY-y>55)closeMobileQuickSheet()},{passive:true});el.mobileQuickContent.addEventListener('click',e=>{const photoGo=e.target.closest('[data-photo-go]');if(photoGo){closeMobileQuickSheet();const target=el.socialPartyGuestList?.querySelector(`[data-party-photo-pick="${photoGo.dataset.photoGo}"]`);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>target.click(),350)}return}if(e.target.closest('[data-photo-close]')){closeMobileQuickSheet();return}const full=e.target.closest('[data-open-full]');if(full){closeMobileQuickSheet();scrollMobileTarget(full.dataset.openFull);return}const voteBtn=e.target.closest('[data-quick-vote]');if(voteBtn){vote(voteBtn.dataset.quickVote,voteBtn);return}const recent=e.target.closest('[data-quick-recent]');if(recent){let list=[];try{list=JSON.parse(localStorage.getItem(recentSearchKey())||'[]')}catch{}const x=list[Number(recent.dataset.quickRecent)];if(x){closeMobileQuickSheet();scrollMobileTarget('requestForm');el.musicSearch.value=`${x.title} ${x.artist||''}`.trim();searchMusic(el.musicSearch.value)}return}const song=e.target.closest('[data-quick-song]');if(song){const x=rows.find(r=>r.id===song.dataset.quickSong);if(x){closeMobileQuickSheet();scrollMobileTarget('requestForm');el.musicSearch.value=`${x.title} ${x.artist||''}`.trim();searchMusic(el.musicSearch.value)}}});el.mobileQuickContent.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='quickSheetSearchInput'){const q=e.target.value.trim();if(q){closeMobileQuickSheet();scrollMobileTarget('requestForm');el.musicSearch.value=q;searchMusic(q)}}});
el.mobileMiniPlayer?.addEventListener('click',()=>{const target=document.getElementById('liveReactions')&&!document.getElementById('liveReactions').hidden?'liveReactions':'nowPlaying';scrollMobileTarget(target);haptic('reaction')});
el.mobileBottomNav?.addEventListener('click',e=>{const b=e.target.closest('[data-mobile-target]');if(!b)return;openQuickByButton(b)});
el.myPartyHub?.addEventListener('click',e=>{const b=e.target.closest('[data-hub-jump]');if(!b)return;const target=document.getElementById(b.dataset.hubJump);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})});
el.feedbackStars?.addEventListener('click',e=>{const b=e.target.closest('[data-rating]');if(!b)return;feedbackState.rating=Number(b.dataset.rating);paintFeedback()});el.feedbackTags?.addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(!b)return;feedbackState.tags.has(b.dataset.tag)?feedbackState.tags.delete(b.dataset.tag):feedbackState.tags.add(b.dataset.tag);paintFeedback()});el.submitDjFeedback.onclick=saveFeedback;el.refreshFeedbackDashboard.onclick=loadFeedbackDashboard;
el.nextUpList?.addEventListener('click',e=>{const b=e.target.closest('[data-next-vote]');if(b)vote(b.dataset.nextVote,b)});el.battleGuestContent?.addEventListener('click',async e=>{const b=e.target.closest('[data-battle-choice]');if(!b||!liveState.battle)return;const {error}=await db.rpc('vote_battle_v54',{p_battle_id:liveState.battle.id,p_visitor_id:visitorToken,p_choice:b.dataset.battleChoice});toast(error?'No se pudo votar':'⚔️ Voto de batalla registrado',error?.message||'','success');await loadLiveExperience()});el.requestDjSurprise.onclick=async()=>{const {error}=await db.rpc('request_dj_surprise_v56',{p_event_id:eventId,p_visitor_id:visitorToken,p_preference:el.djSurprisePreference.value,p_display_name:getGuestNickname()||null});el.djSurpriseStatus.textContent=error?error.message:'🎁 Solicitud enviada al DJ';await loadLiveExperience()};el.startBattle.onclick=async()=>{if(el.battleSongA.value===el.battleSongB.value){el.battleAdminStatus.textContent='Selecciona dos canciones distintas.';return}const {error}=await db.rpc('start_battle_v54',{p_event_id:eventId,p_song_a:el.battleSongA.value,p_song_b:el.battleSongB.value,p_duration_seconds:Number(el.battleDuration.value)});el.battleAdminStatus.textContent=error?error.message:'Batalla iniciada';await loadLiveExperience()};el.endBattle.onclick=async()=>{await db.rpc('end_battle_v54',{p_event_id:eventId});await loadLiveExperience()};el.startChallenge.onclick=async()=>{const {error}=await db.rpc('start_challenge_v55',{p_event_id:eventId,p_title:el.challengeName.value.trim()||'Reto de la fiesta',p_type:el.challengeType.value,p_target:Number(el.challengeTarget.value)});el.challengeAdminStatus.textContent=error?error.message:'Reto activado';await loadLiveExperience()};el.endChallenge.onclick=async()=>{await db.rpc('end_challenge_v55',{p_event_id:eventId});await loadLiveExperience()};el.surpriseAdminList?.addEventListener('click',async e=>{const b=e.target.closest('[data-surprise-status]');if(!b)return;await db.rpc('update_dj_surprise_v56',{p_request_id:b.dataset.surpriseId,p_status:b.dataset.surpriseStatus});await loadLiveExperience()});el.refreshLiveControl.onclick=loadLiveExperience;
el.requestForm.addEventListener('submit',async e=>{e.preventDefault();if(!db||!eventId){setNotice('El evento todavía no está disponible.',true);return}const title=selectedMusic?.title||el.title.value.trim(),artist=selectedMusic?.artist||el.artist.value.trim();if(!title){setNotice('Busca y selecciona una canción, o escríbela manualmente.',true);return}el.sendButton.disabled=true;const payload={event_id:eventId,title,artist:artist||null,requester_name:el.requester.value.trim()||null,message:el.message.value.trim()||null,artwork_url:selectedMusic?.artwork_url||null,external_track_id:selectedMusic?.external_track_id||null,source:selectedMusic?.source||'manual',external_url:selectedMusic?.external_url||null};const {data:newRequestId,error}=await db.rpc('create_song_request_v3',payload);el.sendButton.disabled=false;if(error){const msg=error.message.includes('duplicate')?'Esa canción ya está en la lista. Dale un corazón. ❤️':'No se pudo enviar el pedido.';setNotice(msg,true);toast('No se envió',msg,'error');return}saveMySongId(newRequestId);await trackEngagement('request',newRequestId);await loadMyActivity();await loadGuestGame();el.requestForm.reset();selectedMusic=null;el.selectedMusic.hidden=true;manualSongMode=false;el.manualSongFields.hidden=true;el.manualSongToggle.textContent='✍️ No encuentro la canción, escribir manualmente';clearTimeout(musicSearchTimer);musicSearchSeq++;el.musicSearch.value='';el.clearMusicSearch.hidden=true;el.musicResults.innerHTML='';el.musicResults.hidden=true;el.musicSearchStatus.textContent='';el.surprisePanel.hidden=true;setNotice('¡Pedido enviado al DJ! 🎉');toast('🎉 Pedido enviado','Revisa el ranking y recibe votos','success');await refreshRows()});
el.layoutChoices.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{selectedLayoutMode=b.dataset.layout;renderLayoutChoices()});el.customizeEventButton.onclick=openThemeEditor;el.closeThemeForm.onclick=()=>el.eventThemeForm.hidden=true;el.eventThemeForm.onsubmit=saveEventTheme;el.eventDisplayName.oninput=renderThemePreview;[el.themePrimary,el.themeSecondary,el.themeAccent].forEach(x=>x.oninput=renderThemePreview);el.resetEventTheme.onclick=()=>{selectedThemeKey='neon';const t=eventThemes.neon;el.themePrimary.value=t.primary;el.themeSecondary.value=t.secondary;el.themeAccent.value=t.accent;el.customColors.hidden=true;renderThemeChoices();renderThemePreview()};
el.showEventQr.onclick=openEventQr;el.closeEventQr.onclick=closeEventQr;el.eventQrModal.onclick=e=>{if(e.target===el.eventQrModal)closeEventQr()};el.downloadEventQr.onclick=downloadEventQr;el.copyEventQrLink.onclick=async()=>{try{await navigator.clipboard.writeText(publicEventUrl());toast('🔗 Enlace copiado',publicEventUrl(),'success')}catch{toast('No se pudo copiar','','error')}};
if(el.refreshGuestGame)el.refreshGuestGame.onclick=loadGuestGame;if(el.refreshGameLeaderboard)el.refreshGameLeaderboard.onclick=loadGameLeaderboard;if(el.refreshSmartRanking)el.refreshSmartRanking.onclick=loadSmartRanking;if(el.refreshMyActivity)el.refreshMyActivity.onclick=loadMyActivity;if(el.saveGuestNickname)el.saveGuestNickname.onclick=saveGuestIdentity;if(el.clearGuestNickname)el.clearGuestNickname.onclick=clearGuestIdentity;if(el.refreshAnalytics)el.refreshAnalytics.onclick=loadVisitorAnalytics;el.eventSelector.onchange=()=>switchEvent(el.eventSelector.value);el.newEventButton.onclick=()=>{el.newEventForm.hidden=!el.newEventForm.hidden;if(!el.newEventForm.hidden)el.newEventName.focus()};el.cancelNewEvent.onclick=()=>{el.newEventForm.hidden=true;el.newEventNotice.textContent=''};el.newEventForm.onsubmit=createEvent;el.copyEventLink.onclick=async()=>{try{await navigator.clipboard.writeText(publicEventUrl());toast('🔗 Enlace copiado',publicEventUrl(),'success')}catch{toast('No se pudo copiar el enlace','','error')}};el.toggleEventActive.onclick=toggleCurrentEvent;
el.refreshEventCleanup?.addEventListener('click',loadEventCleanupStats);el.cleanupModules?.addEventListener('click',e=>{const b=e.target.closest('[data-cleanup-module]');if(b)cleanupEventModule(b.dataset.cleanupModule)});el.cleanupAllEvent?.addEventListener('click',cleanupWholeEvent);[el.djAdName,el.djAdHeadline,el.djAdMessage,el.djAdWhatsapp,el.djAdInstagram,el.djAdTiktok,el.djAdEmail,el.djAdCta].forEach(x=>x?.addEventListener('input',renderDjAdPreview));el.saveDjAd?.addEventListener('click',saveDjAd);el.djAdEnabled?.addEventListener('change',renderDjAdPreview);el.djAdFrequency?.addEventListener('change',renderDjAdPreview);el.clearProjectedDedication.onclick=()=>setProjectedDedication(null);el.openScreenMode.onclick=()=>window.open(screenEventUrl(),'pideTuTemaPantalla');el.screenExit.onclick=closeScreenMode;if(el.screenPrevScene)el.screenPrevScene.onclick=()=>partyAdvance(-1);if(el.screenNextScene)el.screenNextScene.onclick=()=>partyAdvance(1);if(el.screenToggleAuto)el.screenToggleAuto.onclick=()=>{partyScreen.auto=!partyScreen.auto;partyRestartTimer()};el.screenFullscreen.onclick=async()=>{try{if(!document.fullscreenElement)await el.screenMode.requestFullscreen();else await document.exitFullscreen()}catch{toast('Pantalla completa no disponible','','error')}};
el.highlightDedication.onclick=showDedicationSpotlight;el.closeDedicationSpotlight.onclick=hideDedicationSpotlight;el.closeDedicationAction.onclick=hideDedicationSpotlight;el.dedicationSpotlight.onclick=e=>{if(e.target===el.dedicationSpotlight)hideDedicationSpotlight()};
el.closeNumberOne.onclick=hideNumberOneCelebration;el.closeNumberOneAction.onclick=hideNumberOneCelebration;el.numberOneCelebration.onclick=e=>{if(e.target===el.numberOneCelebration)hideNumberOneCelebration()};
el.surpriseButton.onclick=openSurprise;el.closeSurprise.onclick=()=>el.surprisePanel.hidden=true;el.shuffleSurprise.onclick=renderSurpriseSuggestions;
el.musicSearch.addEventListener('input',scheduleMusicSearch);el.clearMusicSearch.onclick=()=>{el.musicSearch.value='';el.clearMusicSearch.hidden=true;el.musicResults.hidden=true;el.musicSearchStatus.textContent='';el.musicSearch.focus()};el.manualSongToggle.onclick=toggleManualSong;
function ensureMobileRankingToggle(){const card=el.ranking?.closest('.ranking-card');if(!card||card.querySelector('.mobile-ranking-more'))return;const b=document.createElement('button');b.type='button';b.className='mobile-ranking-more';b.textContent='Ver ranking completo';b.onclick=()=>{const open=card.classList.toggle('show-full-ranking');b.textContent=open?'Ver menos':'Ver ranking completo'};card.appendChild(b)}
el.ranking.addEventListener('click',e=>{const b=e.target.closest('[data-vote]');if(b)vote(b.dataset.vote,b)});el.djList.addEventListener('click',e=>{const b=e.target.closest('[data-status]');if(b)setStatus(b.dataset.id,b.dataset.status)});document.querySelector('[data-view="guest"]').onclick=showGuest;el.djNav.onclick=openDj;el.closeLogin.onclick=()=>el.loginModal.hidden=true;el.loginModal.onclick=e=>{if(e.target===el.loginModal)el.loginModal.hidden=true};el.refreshButton.onclick=refreshRows;el.djSearch.oninput=renderDj;el.statusFilter.onchange=renderDj;el.toggleSound.onclick=()=>{soundEnabled=!soundEnabled;el.toggleSound.classList.toggle('active',soundEnabled);el.toggleSound.textContent=soundEnabled?'🔊 Sonido activado':'🔇 Sonido desactivado';if(soundEnabled)beep()};el.enableNotifications.onclick=async()=>{if(!('Notification'in window)){toast('No compatible','Este navegador no admite notificaciones','error');return}const p=await Notification.requestPermission();el.enableNotifications.textContent=p==='granted'?'✅ Notificaciones activas':'🔕 Notificaciones bloqueadas';toast(p==='granted'?'Notificaciones listas':'Permiso no concedido',p==='granted'?'Te avisaré cuando lleguen pedidos con la pestaña en segundo plano.':'Puedes habilitarlas desde la configuración del navegador.',p==='granted'?'success':'error')};
if(el.toggleSummary)el.toggleSummary.onclick=()=>{const hidden=el.summaryContent.hidden;el.summaryContent.hidden=!hidden;el.toggleSummary.textContent=hidden?'Ocultar':'Mostrar';el.toggleSummary.setAttribute('aria-expanded',String(hidden))};if(el.copySummary)el.copySummary.onclick=async()=>{try{await navigator.clipboard.writeText(summaryText());toast('📋 Resumen copiado','Listo para compartir','success')}catch{toast('No se pudo copiar','Selecciona y copia manualmente','error')}};
el.loginForm.onsubmit=async e=>{e.preventDefault();el.loginButton.disabled=true;el.loginNotice.textContent='Validando acceso…';const {data,error}=await db.auth.signInWithPassword({email:el.loginEmail.value.trim(),password:el.loginPassword.value});el.loginButton.disabled=false;if(error){el.loginNotice.textContent='Correo o contraseña incorrectos.';return}session=data.session;el.loginForm.reset();el.loginNotice.textContent='';await openDj()};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();mobileExperience.deferredInstall=e;el.installPwaButton.hidden=false});el.installPwaButton.onclick=async()=>{if(!mobileExperience.deferredInstall)return;mobileExperience.deferredInstall.prompt();await mobileExperience.deferredInstall.userChoice;mobileExperience.deferredInstall=null;el.installPwaButton.hidden=true};bindAutoUpdate();
el.applyAppUpdate?.addEventListener('click',reloadForUpdate);el.dismissAppUpdate?.addEventListener('click',()=>el.appUpdateBanner.hidden=true);window.matchMedia('(display-mode: standalone)').addEventListener?.('change',renderPushPlatformUx);window.addEventListener('pageshow',renderPushPlatformUx);window.addEventListener('online',recoverNetwork);window.addEventListener('offline',()=>setNetworkState('offline'));if(db)db.auth.onAuthStateChange((event,newSession)=>{session=newSession;if(event==='SIGNED_OUT')showGuest()});async function initializeApp(){if(db){const {data}=await db.auth.getSession();session=data.session||null}await load();const params=new URLSearchParams(location.search);if(params.get('modo')==='pantalla'){openScreenMode();return}if(session){await loadOwnedEvents();renderEventManager()}if(params.get('panel')==='dj'&&session)await openDj()}initializeApp();
