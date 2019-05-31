namespace BizAgi.EntityManager.Entities {

using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Vision.Defs.OracleSpecific;
using BizAgi.PAL;
using BizAgi.PAL.Util;
using BizAgi.PAL.BeanUtils;
using BizAgi.EntityManager.Persistence;
using BizAgi.PAL.historylog;
using BizAgi.Resources;

public class WFUSER : BaseEntity {


	public WFUSER() {
	}

	public override int getIdEnt() {
		return 1;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("35e453a0-755d-4171-80ed-f2618b092ede") ;
	}

	public override String getEntityName() {
		return  "WFUSER";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.WFUSER";
   }

	String surrogateKey = "idUser";

	public override String getSurrogateKey() {
		return surrogateKey;
	}

	public override bool isVirtualEntity() {
		return false;
	}

	public override Dictionary<string, object> getVirtualBusinessKey() {
		return new Dictionary<string, object>() {  };
	}

	public override bool canCreateNewInstances() {
		return true;
	}

    static Dictionary<string, Func<WFUSER, object>> gets = new Dictionary<string, Func<WFUSER, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<WFUSER, object>((WFUSER be) => be.getId() ) }, { "guid", new Func<WFUSER, object>((WFUSER be) => be.GetGuid() ) },
        { "FullName", new Func<WFUSER, object>((WFUSER be) => be.getFullName() )         },
        { "UserName", new Func<WFUSER, object>((WFUSER be) => be.getUserName() )         },
        { "Domain", new Func<WFUSER, object>((WFUSER be) => be.getDomain() )         },
        { "Enabled", new Func<WFUSER, object>((WFUSER be) => be.getEnabled() )         },
        { "IdArea", new Func<WFUSER, object>((WFUSER be) => be.getIdArea() )         },
        { "IdLocation", new Func<WFUSER, object>((WFUSER be) => be.getIdLocation() )         },
        { "IdBossUser", new Func<WFUSER, object>((WFUSER be) => be.getIdBossUser() )         },
        { "NotifByEmail", new Func<WFUSER, object>((WFUSER be) => be.getNotifByEmail() )         },
        { "NotifByMessenger", new Func<WFUSER, object>((WFUSER be) => be.getNotifByMessenger() )         },
        { "NotifByCell", new Func<WFUSER, object>((WFUSER be) => be.getNotifByCell() )         },
        { "ContactEmail", new Func<WFUSER, object>((WFUSER be) => be.getContactEmail() )         },
        { "ContactMessenger", new Func<WFUSER, object>((WFUSER be) => be.getContactMessenger() )         },
        { "ContactCell", new Func<WFUSER, object>((WFUSER be) => be.getContactCell() )         },
        { "WfClassAccessCacheExpiry", new Func<WFUSER, object>((WFUSER be) => be.getWfClassAccessCacheExpiry() )         },
        { "IdWorkingTimeSchema", new Func<WFUSER, object>((WFUSER be) => be.getIdWorkingTimeSchema() )         },
        { "IdDelegate", new Func<WFUSER, object>((WFUSER be) => be.getIdDelegate() )         },
        { "DelegateEnabled", new Func<WFUSER, object>((WFUSER be) => be.getDelegateEnabled() )         },
        { "EnabledForAssignation", new Func<WFUSER, object>((WFUSER be) => be.getEnabledForAssignation() )         },
        { "IdTimeZone", new Func<WFUSER, object>((WFUSER be) => be.getIdTimeZone() )         },
        { "Language", new Func<WFUSER, object>((WFUSER be) => be.getLanguage() )         },
        { "CreatedCasesSkipAssigRules", new Func<WFUSER, object>((WFUSER be) => be.getCreatedCasesSkipAssigRules() )         },
        { "UserPicture", new Func<WFUSER, object>((WFUSER be) => be.getUserPicture() )         },
        { "OfflineForms", new Func<WFUSER, object>((WFUSER be) => be.getOfflineForms() )         },
        { "NormalCost", new Func<WFUSER, object>((WFUSER be) => be.getNormalCost() )         },
        { "OvertimeCost", new Func<WFUSER, object>((WFUSER be) => be.getOvertimeCost() )         },
        { "UserStartPage", new Func<WFUSER, object>((WFUSER be) => be.getUserStartPage() )         }, 
    // FACTS 

        { "Roles", new Func<WFUSER, object>((WFUSER be) => be.getRoles() )         },
        { "Skills", new Func<WFUSER, object>((WFUSER be) => be.getSkills() )         },
        { "Positions", new Func<WFUSER, object>((WFUSER be) => be.getPositions() )         },
        { "Organizations", new Func<WFUSER, object>((WFUSER be) => be.getOrganizations() )         }    };

    static Dictionary<string, Action<WFUSER,object>> sets = new Dictionary<string, Action<WFUSER,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<WFUSER,object>((WFUSER be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<WFUSER,object>((WFUSER be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "FullName", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setFullName(null); else be.setFullName((string) newValue ); })         },
        { "UserName", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setUserName(null); else be.setUserName((string) newValue ); })         },
        { "Domain", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setDomain(null); else be.setDomain((string) newValue ); })         },
        { "Enabled", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setEnabled(null); else be.setEnabled(Convert.ToBoolean(newValue)); })         },
        { "IdArea", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdArea(null); else be.setIdArea((AREA) newValue ); })         },
        { "IdLocation", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdLocation(null); else be.setIdLocation((LOCATION) newValue ); })         },
        { "IdBossUser", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdBossUser(null); else be.setIdBossUser((WFUSER) newValue ); })         },
        { "NotifByEmail", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setNotifByEmail(null); else be.setNotifByEmail(Convert.ToBoolean(newValue)); })         },
        { "NotifByMessenger", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setNotifByMessenger(null); else be.setNotifByMessenger(Convert.ToBoolean(newValue)); })         },
        { "NotifByCell", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setNotifByCell(null); else be.setNotifByCell(Convert.ToBoolean(newValue)); })         },
        { "ContactEmail", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setContactEmail(null); else be.setContactEmail((string) newValue ); })         },
        { "ContactMessenger", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setContactMessenger(null); else be.setContactMessenger((string) newValue ); })         },
        { "ContactCell", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setContactCell(null); else be.setContactCell((string) newValue ); })         },
        { "WfClassAccessCacheExpiry", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setWfClassAccessCacheExpiry(null); else be.setWfClassAccessCacheExpiry(Convert.ToDateTime(newValue)); })         },
        { "IdWorkingTimeSchema", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdWorkingTimeSchema(null); else be.setIdWorkingTimeSchema((WORKINGTIMESCHEMA) newValue ); })         },
        { "IdDelegate", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdDelegate(null); else be.setIdDelegate((WFUSER) newValue ); })         },
        { "DelegateEnabled", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setDelegateEnabled(null); else be.setDelegateEnabled(Convert.ToBoolean(newValue)); })         },
        { "EnabledForAssignation", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setEnabledForAssignation(null); else be.setEnabledForAssignation(Convert.ToBoolean(newValue)); })         },
        { "IdTimeZone", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setIdTimeZone(null); else be.setIdTimeZone((BATIMEZONE) newValue ); })         },
        { "Language", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setLanguage(null); else be.setLanguage((LANGUAGE) newValue ); })         },
        { "CreatedCasesSkipAssigRules", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setCreatedCasesSkipAssigRules(null); else be.setCreatedCasesSkipAssigRules(Convert.ToBoolean(newValue)); })         },
        { "UserPicture", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setUserPicture(null); else be.setUserPicture((FileUploadRecord) newValue ); })         },
        { "OfflineForms", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setOfflineForms(null); else be.setOfflineForms(Convert.ToBoolean(newValue)); })         },
        { "NormalCost", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setNormalCost(null); else be.setNormalCost(Convert.ToDecimal(newValue)); })         },
        { "OvertimeCost", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setOvertimeCost(null); else be.setOvertimeCost(Convert.ToDecimal(newValue)); })         },
        { "UserStartPage", new Action<WFUSER, object>((WFUSER be, object newValue) => { if(newValue==null)be.setUserStartPage(null); else be.setUserStartPage((USERSTARTPAGE) newValue ); })         }, 
    // FACTS 

        { "Roles", new Action<WFUSER, object>((WFUSER be, object newValue) => be.setRoles((ArrayList) newValue ) )         },
        { "Skills", new Action<WFUSER, object>((WFUSER be, object newValue) => be.setSkills((ArrayList) newValue ) )         },
        { "Positions", new Action<WFUSER, object>((WFUSER be, object newValue) => be.setPositions((ArrayList) newValue ) )         },
        { "Organizations", new Action<WFUSER, object>((WFUSER be, object newValue) => be.setOrganizations((ArrayList) newValue ) )         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getFullName() != null ? getFullName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_fullName ;

	public string getFullName() {
		return m_fullName;
	}

	public void setFullName(string paramfullName){
		this.m_fullName = paramfullName;
	}

	string m_userName ;

	public string getUserName() {
		return m_userName;
	}

	public void setUserName(string paramuserName){
		this.m_userName = paramuserName;
	}

	string m_domain ;

	public string getDomain() {
		return m_domain;
	}

	public void setDomain(string paramdomain){
		this.m_domain = paramdomain;
	}

	bool? m_enabled  = new bool?(true);

	public bool? getEnabled() {
		return m_enabled;
	}

	public void setEnabled(bool? paramenabled){
		this.m_enabled = paramenabled;
	}

	AREA m_idArea ;

	public AREA getIdArea() {
		if ((!this.isPersisting()) && (m_idArea != null) ) { 
			m_idArea = (AREA)getPersistenceManager().find(m_idArea.getClassName(), m_idArea.getId());
		}
		return m_idArea;
	}

	public void setIdArea(AREA paramidArea){
		this.m_idArea = paramidArea;
	}

	LOCATION m_idLocation ;

	public LOCATION getIdLocation() {
		if ((!this.isPersisting()) && (m_idLocation != null) ) { 
			m_idLocation = (LOCATION)getPersistenceManager().find(m_idLocation.getClassName(), m_idLocation.getId());
		}
		return m_idLocation;
	}

	public void setIdLocation(LOCATION paramidLocation){
		this.m_idLocation = paramidLocation;
	}

	WFUSER m_idBossUser ;

	public WFUSER getIdBossUser() {
		if ((!this.isPersisting()) && (m_idBossUser != null) ) { 
			m_idBossUser = (WFUSER)getPersistenceManager().find(m_idBossUser.getClassName(), m_idBossUser.getId());
		}
		return m_idBossUser;
	}

	public void setIdBossUser(WFUSER paramidBossUser){
		this.m_idBossUser = paramidBossUser;
	}

	bool? m_notifByEmail  = new bool?(true);

	public bool? getNotifByEmail() {
		return m_notifByEmail;
	}

	public void setNotifByEmail(bool? paramnotifByEmail){
		this.m_notifByEmail = paramnotifByEmail;
	}

	bool? m_notifByMessenger ;

	public bool? getNotifByMessenger() {
		return m_notifByMessenger;
	}

	public void setNotifByMessenger(bool? paramnotifByMessenger){
		this.m_notifByMessenger = paramnotifByMessenger;
	}

	bool? m_notifByCell ;

	public bool? getNotifByCell() {
		return m_notifByCell;
	}

	public void setNotifByCell(bool? paramnotifByCell){
		this.m_notifByCell = paramnotifByCell;
	}

	string m_contactEmail ;

	public string getContactEmail() {
		return m_contactEmail;
	}

	public void setContactEmail(string paramcontactEmail){
		this.m_contactEmail = paramcontactEmail;
	}

	string m_contactMessenger ;

	public string getContactMessenger() {
		return m_contactMessenger;
	}

	public void setContactMessenger(string paramcontactMessenger){
		this.m_contactMessenger = paramcontactMessenger;
	}

	string m_contactCell ;

	public string getContactCell() {
		return m_contactCell;
	}

	public void setContactCell(string paramcontactCell){
		this.m_contactCell = paramcontactCell;
	}

	DateTime? m_wfClassAccessCacheExpiry ;

	public DateTime? getWfClassAccessCacheExpiry() {
		return m_wfClassAccessCacheExpiry;
	}

	public void setWfClassAccessCacheExpiry(DateTime? paramwfClassAccessCacheExpiry){
		this.m_wfClassAccessCacheExpiry = paramwfClassAccessCacheExpiry;
	}

	WORKINGTIMESCHEMA m_idWorkingTimeSchema ;

	public WORKINGTIMESCHEMA getIdWorkingTimeSchema() {
		if ((!this.isPersisting()) && (m_idWorkingTimeSchema != null) ) { 
			m_idWorkingTimeSchema = (WORKINGTIMESCHEMA)getPersistenceManager().find(m_idWorkingTimeSchema.getClassName(), m_idWorkingTimeSchema.getId());
		}
		return m_idWorkingTimeSchema;
	}

	public void setIdWorkingTimeSchema(WORKINGTIMESCHEMA paramidWorkingTimeSchema){
		this.m_idWorkingTimeSchema = paramidWorkingTimeSchema;
	}

	WFUSER m_idDelegate ;

	public WFUSER getIdDelegate() {
		if ((!this.isPersisting()) && (m_idDelegate != null) ) { 
			m_idDelegate = (WFUSER)getPersistenceManager().find(m_idDelegate.getClassName(), m_idDelegate.getId());
		}
		return m_idDelegate;
	}

	public void setIdDelegate(WFUSER paramidDelegate){
		this.m_idDelegate = paramidDelegate;
	}

	bool? m_DelegateEnabled ;

	public bool? getDelegateEnabled() {
		return m_DelegateEnabled;
	}

	public void setDelegateEnabled(bool? paramDelegateEnabled){
		this.m_DelegateEnabled = paramDelegateEnabled;
	}

	bool? m_enabledForAssignation  = new bool?(true);

	public bool? getEnabledForAssignation() {
		return m_enabledForAssignation;
	}

	public void setEnabledForAssignation(bool? paramenabledForAssignation){
		this.m_enabledForAssignation = paramenabledForAssignation;
	}

	BATIMEZONE m_idTimeZone ;

	public BATIMEZONE getIdTimeZone() {
		if ((!this.isPersisting()) && (m_idTimeZone != null) ) { 
			m_idTimeZone = (BATIMEZONE)getPersistenceManager().find(m_idTimeZone.getClassName(), m_idTimeZone.getId());
		}
		return m_idTimeZone;
	}

	public void setIdTimeZone(BATIMEZONE paramidTimeZone){
		this.m_idTimeZone = paramidTimeZone;
	}

	LANGUAGE m_language ;

	public LANGUAGE getLanguage() {
		if ((!this.isPersisting()) && (m_language != null) ) { 
			m_language = (LANGUAGE)getPersistenceManager().find(m_language.getClassName(), m_language.getId());
		}
		return m_language;
	}

	public void setLanguage(LANGUAGE paramlanguage){
		this.m_language = paramlanguage;
	}

	bool? m_CreatedCasesSkipAssigRules  = new bool?(false);

	public bool? getCreatedCasesSkipAssigRules() {
		return m_CreatedCasesSkipAssigRules;
	}

	public void setCreatedCasesSkipAssigRules(bool? paramCreatedCasesSkipAssigRules){
		this.m_CreatedCasesSkipAssigRules = paramCreatedCasesSkipAssigRules;
	}

	FileUploadRecord m_userPicture;

	public FileUploadRecord createUserPicture() {
	   m_userPicture = (FileUploadRecord)BAPropertyUtils.createEntityInstance("FileUploadRecord");
      m_userPicture.setHistoryLog(getHistoryLog());
      m_userPicture.setPersistenceManager(getPersistenceManager());
      BAPropertyUtils.setPropertyXPath(m_userPicture,"idAttrib", new int?(73));
      BAPropertyUtils.setPropertyXPath(m_userPicture,"idContentType", (Guid?)null);
      BAPropertyUtils.setPropertyXPath(this, "userPicture", m_userPicture);
      BAPropertyUtils.setPropertyXPath(m_userPicture,"parentEntity",this);
      return m_userPicture;
   }

	public FileUploadRecord getUserPicture() {
       if (m_userPicture == null) {
			ArrayList tempUploads = getUploads(73,(Guid?)null);
           if (tempUploads.Count > 0) m_userPicture = (FileUploadRecord)tempUploads[0];
       }
       if (m_userPicture != null) {
           m_userPicture = (FileUploadRecord)ApplyScopeChangesToEntity(m_userPicture);
       }
       return m_userPicture;
   }

	public void setUserPicture(FileUploadRecord paramuserPicture){
       this.m_userPicture = paramuserPicture;
	}

	bool? m_offlineForms  = new bool?(true);

	public bool? getOfflineForms() {
		return m_offlineForms;
	}

	public void setOfflineForms(bool? paramofflineForms){
		this.m_offlineForms = paramofflineForms;
	}

	decimal? m_normalCost ;

	public decimal? getNormalCost() {
		return m_normalCost;
	}

	public void setNormalCost(decimal? paramnormalCost){
		this.m_normalCost = paramnormalCost;
	}

	decimal? m_overtimeCost ;

	public decimal? getOvertimeCost() {
		return m_overtimeCost;
	}

	public void setOvertimeCost(decimal? paramovertimeCost){
		this.m_overtimeCost = paramovertimeCost;
	}

	USERSTARTPAGE m_userStartPage ;

	public USERSTARTPAGE getUserStartPage() {
		if ((!this.isPersisting()) && (m_userStartPage != null) ) { 
			m_userStartPage = (USERSTARTPAGE)getPersistenceManager().find(m_userStartPage.getClassName(), m_userStartPage.getId());
		}
		return m_userStartPage;
	}

	public void setUserStartPage(USERSTARTPAGE paramuserStartPage){
		this.m_userStartPage = paramuserStartPage;
	}

	ArrayList Roles = null;

	public ArrayList getRoles() {
			if (!isPersisting()){
					if (Roles == null){
						Roles = this.loadFact("Roles");
						// Finally apply changes to the current entity
						getPersistenceManager().applyHistoryLogToFact(this, "Roles");
					}
			}
			return Roles;
	}

	public void setRoles(ArrayList Roles){
		if ( Roles != null ) { 
			this.Roles = Roles;
			this.Roles = reloadFact("Roles");
		} else { 
			this.Roles = null;
		}
	}

	ArrayList Skills = null;

	public ArrayList getSkills() {
			if (!isPersisting()){
					if (Skills == null){
						Skills = this.loadFact("Skills");
						// Finally apply changes to the current entity
						getPersistenceManager().applyHistoryLogToFact(this, "Skills");
					}
			}
			return Skills;
	}

	public void setSkills(ArrayList Skills){
		if ( Skills != null ) { 
			this.Skills = Skills;
			this.Skills = reloadFact("Skills");
		} else { 
			this.Skills = null;
		}
	}

	ArrayList Positions = null;

	public ArrayList getPositions() {
			if (!isPersisting()){
					if (Positions == null){
						Positions = this.loadFact("Positions");
						// Finally apply changes to the current entity
						getPersistenceManager().applyHistoryLogToFact(this, "Positions");
					}
			}
			return Positions;
	}

	public void setPositions(ArrayList Positions){
		if ( Positions != null ) { 
			this.Positions = Positions;
			this.Positions = reloadFact("Positions");
		} else { 
			this.Positions = null;
		}
	}

	ArrayList Organizations = null;

	public ArrayList getOrganizations() {
			if (!isPersisting()){
					if (Organizations == null){
						Organizations = this.loadFact("Organizations");
						// Finally apply changes to the current entity
						getPersistenceManager().applyHistoryLogToFact(this, "Organizations");
					}
			}
			return Organizations;
	}

	public void setOrganizations(ArrayList Organizations){
		if ( Organizations != null ) { 
			this.Organizations = Organizations;
			this.Organizations = reloadFact("Organizations");
		} else { 
			this.Organizations = null;
		}
	}

   public override object getXPath(PropertyTokenizer xPathTokenizer) {
       String completeXPath = xPathTokenizer.getCurrentPath();
               return BizAgi.PAL.XPath.XPathUtil.evaluateXPath(this, completeXPath);
   }

    public override IBaseEntity addRelationWithId(String path, long id, bool createBackRelationScopeAction, bool createHistoryLogActions, bool isAttach = true) {
        try {
        BaseEntity ret = null;
        String attrRelated = null;
        bool bIsMxMFact = false;
  if(!gets.ContainsKey(path)){ return base.addRelationWithId(path, id, createBackRelationScopeAction, createHistoryLogActions, isAttach ); }  
 
		if (path.Equals("Roles")) {
			bIsMxMFact = true;
            if (Roles == null) {
				//Load the entities from the DB
				Roles = this.loadFact("Roles");
				// then apply changes to the current entity
				getPersistenceManager().applyHistoryLogToFact(this, "Roles");
            }
            if (id == 0) {
                ret = (BaseEntity)BAPropertyUtils.createEntityInstance("ROLE");
            } else {
				 ret = (ROLE)getPersistenceManager().find("BizAgi.EntityManager.Entities.ROLE", id);
            }
			Roles.Add(ret);
		}
		if (path.Equals("Skills")) {
			bIsMxMFact = true;
            if (Skills == null) {
				//Load the entities from the DB
				Skills = this.loadFact("Skills");
				// then apply changes to the current entity
				getPersistenceManager().applyHistoryLogToFact(this, "Skills");
            }
            if (id == 0) {
                ret = (BaseEntity)BAPropertyUtils.createEntityInstance("SKILL");
            } else {
				 ret = (SKILL)getPersistenceManager().find("BizAgi.EntityManager.Entities.SKILL", id);
            }
			Skills.Add(ret);
		}
		if (path.Equals("Positions")) {
			bIsMxMFact = true;
            if (Positions == null) {
				//Load the entities from the DB
				Positions = this.loadFact("Positions");
				// then apply changes to the current entity
				getPersistenceManager().applyHistoryLogToFact(this, "Positions");
            }
            if (id == 0) {
                ret = (BaseEntity)BAPropertyUtils.createEntityInstance("ORGPOSITION");
            } else {
				 ret = (ORGPOSITION)getPersistenceManager().find("BizAgi.EntityManager.Entities.ORGPOSITION", id);
            }
			Positions.Add(ret);
		}
		if (path.Equals("Organizations")) {
			bIsMxMFact = true;
            if (Organizations == null) {
				//Load the entities from the DB
				Organizations = this.loadFact("Organizations");
				// then apply changes to the current entity
				getPersistenceManager().applyHistoryLogToFact(this, "Organizations");
            }
            if (id == 0) {
                ret = (BaseEntity)BAPropertyUtils.createEntityInstance("ORG");
            } else {
				 ret = (ORG)getPersistenceManager().find("BizAgi.EntityManager.Entities.ORG", id);
            }
			Organizations.Add(ret);
		}

        if (ret == null) {
            throw new BABeanUtilsException("Path not found. Path:" + path);
        } else {
            ret.setHistoryLog(getHistoryLog());
            ret.setPersistenceManager(getPersistenceManager());
            if (!bIsMxMFact) {
				if (createBackRelationScopeAction) {
					ret.setXPath(attrRelated, this);
				} else {
					PropertyUtils.setProperty(ret, attrRelated, this);
				}
            }
            return ret;
        }
        } catch (Exception e) {
           throw new BABeanUtilsException(e);
        }
    }

	public override IBaseEntity addRelation(String path, long id) {
		BaseEntity ret = (BaseEntity)addRelationWithId(path, id, true, true);
         ScopeAction action;
       if (getEntityType().Value == 0) {// PV Entity
           action = ScopeActionFactory.getAddRelationAction(ret.getId(), path);
       } else {
           action = ScopeActionFactory.getAddRelationEntityAction(this.getClassName(), this.getId(), ret.getId(), path);
       }
       getHistoryLog().add(action);
       return ret;
	}

	public override String toXML()  {
		StringBuilder xml = new StringBuilder();
		return xml.ToString();
	}
	public override Object getLocalizedValue(String attributeName) {
		Object attributeValue = this.getXPath(attributeName);		
		return attributeValue;
	}
	public override bool containsAttribute(string propertyName) {
		return gets.ContainsKey(propertyName); 
	}
	protected override Object GetPropertyValueByName(string propertyName) {
		if(gets.ContainsKey(propertyName)) 
		    return gets[propertyName].Invoke(this); 
		else if (this.GetType().BaseType != typeof(BaseEntity)) 
		    return base.GetPropertyValueByName(propertyName); 
		throw new Exception("Attribute not found"); 
	}
	public override void SetPropertyValue(string propertyName, object newValue) {
	    if(newValue == DBNull.Value) 
	        newValue = null; 
	    if(sets.ContainsKey(propertyName)){ 
	        sets[propertyName].Invoke(this, newValue); 
	        return; 
		}else if (this.GetType().BaseType != typeof(BaseEntity)){ 
	        base.SetPropertyValue(propertyName, newValue); return;  }
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "WFUSER")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "WFUSER";      
		else if (this.GetType().BaseType != typeof(BaseEntity))  
		   return base.GetFactOwnerEntityName(factName);      
		throw new Exception("Fact entity not found for '"+ factName + "' "); 
	}
	public override string GetFactOwnerAttribute(string factKey) {
		return _factToParentAttribute[factKey]; 
	}
	public override bool ExistsFactOwnerAttribute(string factKey) {
		return _factToParentAttribute.ContainsKey(factKey); 
	}
	protected override void  cloneValues(object target, Hashtable reentrance){

    WFUSER tg = (WFUSER) target; 
    cloneBaseValues(tg);
    tg.m_fullName = this.m_fullName; 
    tg.m_userName = this.m_userName; 
    tg.m_domain = this.m_domain; 
    tg.m_enabled = this.m_enabled; 
    tg.m_idArea = (AREA)cloneRelation(this.m_idArea); 
    tg.m_idLocation = (LOCATION)cloneRelation(this.m_idLocation); 
    tg.m_idBossUser = (WFUSER)cloneRelation(this.m_idBossUser); 
    tg.m_notifByEmail = this.m_notifByEmail; 
    tg.m_notifByMessenger = this.m_notifByMessenger; 
    tg.m_notifByCell = this.m_notifByCell; 
    tg.m_contactEmail = this.m_contactEmail; 
    tg.m_contactMessenger = this.m_contactMessenger; 
    tg.m_contactCell = this.m_contactCell; 
    tg.m_wfClassAccessCacheExpiry = this.m_wfClassAccessCacheExpiry; 
    tg.m_idWorkingTimeSchema = (WORKINGTIMESCHEMA)cloneRelation(this.m_idWorkingTimeSchema); 
    tg.m_idDelegate = (WFUSER)cloneRelation(this.m_idDelegate); 
    tg.m_DelegateEnabled = this.m_DelegateEnabled; 
    tg.m_enabledForAssignation = this.m_enabledForAssignation; 
    tg.m_idTimeZone = (BATIMEZONE)cloneRelation(this.m_idTimeZone); 
    tg.m_language = (LANGUAGE)cloneRelation(this.m_language); 
    tg.m_CreatedCasesSkipAssigRules = this.m_CreatedCasesSkipAssigRules; 
    tg.m_userPicture = this.m_userPicture; 
    tg.m_offlineForms = this.m_offlineForms; 
    tg.m_normalCost = this.m_normalCost; 
    tg.m_overtimeCost = this.m_overtimeCost; 
    tg.m_userStartPage = (USERSTARTPAGE)cloneRelation(this.m_userStartPage); 

}

 
	}

}