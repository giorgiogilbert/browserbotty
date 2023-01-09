
import { By } from "selenium-webdriver";

class BrowserBotty {

    constructor( driver ){

        this.debugMode = false;
        this.driver = driver;
    }

    debug( output ){
        if( this.debug ){
            console.log( output );
        }
    }

    addCredentialsToUrl( url, usr, pwd ){

        let protocol = 'https';
        if( url.includes('://') ){
            let urlParts = url.split('://');
            protocol = urlParts[0];
            url = urlParts[1];
        }
        return `${protocol}://${usr}:${pwd}@${url}`;
    }

    async gotoUrl( url ){

        await this.driver.get(url);
    }

    async getCurrentUrl(){

        let url = await this.driver.getCurrentUrl();
        return url;
    }

    async sleep( ms=1000 ){

        await this.driver.sleep( ms );
    }

    async quit(){

        await this.driver.quit();
    }

    async click( cssSelector ){

        await this.driver.findElement( By.css( cssSelector) ).click();
    }

    async clickAndWait( cssSelector, sleepTimeMs=500 ){

        await this.click( cssSelector );
        await this.driver.sleep( sleepTimeMs );
    }

    async clickMultipleItems( cssSelector, limit=99 ){
        const items = await this.driver.findElements( By.css( cssSelector ) );
        let counter = 0;
        for( let item of items ){
            counter ++ ;
            await item.click();
            if( counter >= limit ){
                break;
            }
        }
    }

    async findInPage( cssSelector ){

        const els = await this.driver.findElements(By.css(cssSelector));
        return els;
    }
    async findInPageSingle( cssSelector ){

        try {
            const el = await this.driver.findElement(By.css(cssSelector));
            return el;
        } catch( e ){
            if( e.name === "NoSuchElementError" || e.name === "NoSuchElementException" ){
               return null;
            }
            throw e;
        }
    }

    async getChildren( element, cssSelector ){

        const children = await element.findElements(By.css(cssSelector));
        return children;
    }

    async typeIntoTextInput( formObject, cssSelector, text ){

        let input = await formObject.findElement(By.css( cssSelector ));
        await input.sendKeys( text );
    }

    async getText( cssSelector ){

        let item = await this.findInPageSingle(cssSelector);
        let text = await item.getText();
        return text;
    }

    async switchToIframeInWrapper( wrapperCssSelector ){

        // iframe tag is required to have own ID
        let wrapper = await this.findInPageSingle( wrapperCssSelector );
        let iframe = await wrapper.findElement(By.css('iframe'));
        let iframeId = await iframe.getAttribute('id');
        await this.driver.switchTo().frame( iframeId );
    }

    async switchToWindow( index=0 ){

        let target = '';
        const handles = await this.driver.getAllWindowHandles();
        for( let i=0; i<=index; i++ ){
            if( i >= handles.length ){
                throw "Window #"+i+" requested, but only "+handles.length+" windows detected.";
            }
            target = handles[i];
        }
        await this.driver.switchTo().window( target );
    }

    async waitUntilHidden( cssSelector, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let el = await driver.findElement( By.css( cssSelector ) );
            let isDisplayed = await el.isDisplayed();
            return !isDisplayed;

        }, timeoutMs );
    }

    async waitUntilExists( cssSelector, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let els = await driver.findElements( By.css( cssSelector ) );
            if( els.length > 0 ){
                return true;
            }
            return false;

        }, timeoutMs );
    }

    async waitUntilRemoved( cssSelector, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let els = await driver.findElements( By.css( cssSelector ) );
            if( els.length > 0 ){
                return false;
            }
            return true;

        }, timeoutMs );
    }

    async waitUntilClickable( cssSelector, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let els = await driver.findElements( By.css( cssSelector ) );
            if( els.length<1 ){
                return false;
            }
            let el = els[0];
            let isDisplayed = await el.isDisplayed();
            let isEnabled = await el.isEnabled();
            let isClickable = isDisplayed && isEnabled;
            return isClickable;

        }, timeoutMs );
    }

    async waitUntilTextIs( cssSelector, condition, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let el = await driver.findElement( By.css( cssSelector ) );
            let scrapedText = await el.getText();
            if( typeof condition==='function' ){
                return condition( scrapedText );
            }
            return scrapedText == condition;

        }, timeoutMs );
    }

    async waitUntilHasClass( cssSelector, targetClass, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let el = await driver.findElement( By.css( cssSelector ) );
            let hasClass = await this.hasClass( el, targetClass );
            return hasClass;

        }, timeoutMs );
    }

    async waitUntilHasNotClass( cssSelector, targetClass, timeoutMs ){

        let driver = this.driver
        await driver.wait( async ()=>{

            let el = await driver.findElement( By.css( cssSelector ) );
            let hasClass = await this.hasClass( el, targetClass );
            return !hasClass;

        }, timeoutMs );
    }

    async hasClass( htmlNode, targetClass ){

        let classAttr = await htmlNode.getAttribute('class');
        let classList = classAttr.split(" ");
        for( let cl of classList ){
            if( cl == targetClass ){
                return true;
            }
        }
        return false;
    }

    async waitUntilUrlMatches( pattern, timeoutMs ){

        let driver = this.driver;
        await driver.wait( async ()=>{

            let url = await driver.getCurrentUrl();
            return url.match( pattern );

        }, timeoutMs );
    }

    async waitUntilUrlIs( expectedUrl, timeoutMs ){

        let driver = this.driver;
        await driver.wait( async ()=>{

            let url = await driver.getCurrentUrl();
            return url===expectedUrl;

        }, timeoutMs );
    }

    async waitUntilWindowsNumberIs( n, timeoutMs ){

        let driver = this.driver;
        await driver.wait( async ()=>{

            let handles = await driver.getAllWindowHandles();
            return ( handles.length === n );

        }, timeoutMs );
    }
}
export { BrowserBotty };