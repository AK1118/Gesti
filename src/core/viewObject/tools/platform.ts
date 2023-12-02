class Platform{
    //是否浏览器
    static get isBrowser ():boolean{
        return typeof window!=="undefined";
    }
    //是否微信
    static get isWeChatMiniProgram():boolean{
        return typeof wx!=="undefined";
    }
    static get platform():PlatformType{
        if(Platform.isBrowser)return "Browser";
        if(Platform.isWeChatMiniProgram)return "WeChat";
        return "Browser";
    }

    static get isTikTok():boolean{
        return typeof tt!=="undefined";
    }
}

export default Platform;