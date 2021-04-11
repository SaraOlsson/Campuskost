
import Button from '@material-ui/core/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'

let src_flag_en = require('../../assets/en_flag.png')
let src_flag_sv = require('../../assets/sv_flag.png')


export default function TranslateOptions()
{
  
    // variant='contained' color='primary'
    const {i18n} = useTranslation('common')
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button onClick={() => i18n.changeLanguage('sv')} 
        style={{
          margin: 15
        }}>
          Svenska <img src={src_flag_sv} style={{ width: 20, marginLeft: 8}}/>
        </Button>
        
        <Button onClick={() => i18n.changeLanguage('en')}
        style={{
          margin: 15
        }}>
          English <img src={src_flag_en} style={{ width: 20, marginLeft: 8}}/>
        </Button>
      </div>
    )
}