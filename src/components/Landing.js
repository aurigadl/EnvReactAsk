import React from 'react'

const Landing = React.createClass({
  render() {
    return (
      <div class="row">
        <br />
        <div className="medium-6 columns">
          <p className="text-justify">
            PRIMERA: A partir del primero (1) de diciembre de 2014, las empresas de Servicio Público de Transporte
            Terrestre Automotor Especial expedirán el Formato Único de Extracto de Contrato FUEC, adoptado en la presente
            resolución, impreso en papel Bond, mínimo de 60 gramos, con membrete de la empresa.
          </p>
          <p className="text-justify">
            SEGUNDA: A partir del primero (1) de marzo de dos mil quince (2015), el Formato Único de Extracto de Contrato
            FUEC, adoptado en la presente resolución, será expedido por las empresas, de acuerdo a las especificaciones de
            seguridad que adoptará por Acto Administrativo la Dirección de Transporte y Tránsito.
          </p>
          <p className="text-justify">
            Para tal efecto, las empresas deben contar con un sistema de información para la expedición del Formato Único
            de Extracto de Contrato FUEC, sistema en el cual se debe registrar el objeto del contrato, el valor, partes
            contratantes, cantidad de unidades a contratar por clase de vehículos, fecha de inicio y fecha de terminación
            y origen - destino describiendo el recorrido.
          </p>
        </div>
        <div className="medium-6 columns">
          <p className="text-justify">
            Dicha medida se aplicará hasta que el Ministerio de Transporte implemente la plataforma tecnológica para la
            expedición en línea y en tiempo real del FUEC.
          </p>
          <p className="text-justify">
            TERCERA. Una vez el Ministerio de Transporte implemente la plataforma tecnológica se registrará como mínimo el
            objeto del contrato, valor, partes contratantes, cantidad de unidades a contratar por clase de vehículo, fecha
            de inicio y fecha de terminación, origen - destino describiendo el recorrido, la relación de las personas que
            se transportan y los vehículos que prestan el servicio y se expedirá directamente el Formato Único de Extracto
            de Contrato FUEC.
          </p>
          <p className="text-justify">
            Parágrafo: La Superintendencia de Puertos y Transporte y el Ministerio de Transporte podrán en cualquier
            momento solicitar, a la empresa de transporte, el respectivo contrato de prestación del servicio de transporte
            especial, con la relación de las personas movilizadas, por tal razón, éstas deben mantenerlos en sus archivos.
          </p>
        </div>
      </div>
      )
  }
})

export default Landing
