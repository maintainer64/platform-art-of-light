# ArtOfLight platform API
В данной документации описаны все REST-API методы для платформы тестированя, alerting'a и принятия телеметрии с NbIot устройств

В нашем примере платформа развёрнута на адресе localhost

Базовый url для всех запросов к платформе: `https://localhost/api/`

### Sensors
Настраиваемые политики для девайсов платформы. Их добавление в остлеживаемые, изменение имени. Объединение в группы устройств.

#### Добавление нового устройств или обновление имени
`POST https://localhost/api/sensor/list`
```pydocstring
:param name: Имя устройства для отображения в интерфейсе
:type name: str 
:param id: Строка идентификатора
:type id: str
:return: Тот-же объект при сохранении
:raise: Validation error
```
*Пример запроса 1:*
Успешное добавление устройства в отслеживаемые
```json
{
    "id": "3878379483",
    "name": "FirstSensor"
}
```
*Пример ответа 1:*
```json
{
    "id": "id",
    "name": "FirstSensor"
}
```
*Пример запроса 2:*

Не успешное добавление устройства в остлеживаемые
```json
{
    "error": "Id is not defined"
}
```
*Пример ответа 2:*
```json
{
    "result": {
        "regions": [
            {
                "id": 7,
                "region_name": "ХабаровскИТагил",
                "count": 2
            },
            {
                "id": 6,
                "region_name": "ВладимирИХлеб!",
                "count": 11
            }
        ]
    },
    "jsonrpc": "2.0",
    "id": 0
}
```

#### Удаление устройств из отслеживаемых по идентификаторам
`DELETE https://localhost/api/sensor/list`
```pydocstring
:param ids: Идентификаторы устройств для удаления
:type ids: List[str]
:return: Успешный ответ содержит объект {"status": "ok"}
:raise: ValidationError
```
*Пример запроса 1-2:*
```json
{
    "ids": ["1"]
}
```
*Пример ответа 1:*

Успешное удаление устройства из отслеживаемых
```json
{
    "status": "ok"
}
```

*Пример ответа 2:*

ValidationError
```json
{
    "message": "Invalid JSON",
    "source": {
        "id": "99ed13d.a5152f",
        "type": "json-schema-validator",
        "name": "ValidationError",
        "count": 1
    }
}
```


#### Просмотр последней телеметрии устройств
`GET https://localhost/api/sensor/list`
```pydocstring
:return: Массив объектов с последней посылкой телеметрии (за 2.5 часа) и доп информацией
:type return: List[Object]
:type Object:
    :data object: Информация о имени устройства
        :name: Имя устройства
        :name type: str
        :id: Идентификатор устройства
        :id type: str
    :command object: Информация о команде для устройства
        :auto: Флаг установки автономной работы устройства
        :auto type: bool
        :level_light: Уровень яркости лампы на устройстве
        :level_light type: int (min=0, max=100)
    :status object: Информация об ошибках устройства
        :telegram: Время посылки сообщения об ошибке на внешнюю платформу 
        :telegram type: timestamp (iso)
    :influx object: Объект телеметрии последней посылки устройства
        :ICCID: Идентификатор
        :ICCID type: str
        :Tamb_degC: Темпиратура
        :Tamb_degC type: int
        :level_light: Уровень яркости ламп на момент посылки
        :level_light type: int
        :longitude: Долгота
        :longitude type: float
        :latitude: Широта
        :latitude type: float
        :light: Информация об уровне освещения внешнего
        :light type: float

```
*Пример ответа 1:*
```json
[
    {
        "data": {
            "name": "First",
            "id": "1"
        },
        "command": {
            "auto": true,
            "level_light": 100
        },
        "status": {
            "telegram": "2021-05-30T09:57:05.168Z"
        },
        "influx": {
            "ICCID": "1",
            "Tamb_degC": 32,
            "latitude": 0.019910,
            "level_light": 100,
            "light": 0,
            "longitude": 0.00593
        }
    }
]
```

#### Просмотр всех доступных устройств
`GET https://localhost/api/sensor/all`
```pydocstring
:return: Идентификаторы всех доступных устройств
:return type: List[str]
```

*Пример ответа 1:*
```json
{
    "jsonrpc": "2.0",
    "id": 0,
    "result": {
        "id": 1,
        "region_name": "Новое название для региона"
    }
}
```
*Пример ответа 2:*

Не успешная операция
```json
[
    "3878379483",
    "1"
]
```

### Mocks
Настраиваемые политики для изменяемых данных с устройств на платформе. Вы можете отправлять телеметрию с устройств, которые могут содержать не все данные для платформы.

#### Установка вариаций данных для устройства
`POST https://localhost/api/mock`
```pydocstring
:param light: Яркость лампы для освещения
:param Tamb_degC: Темпиратура внутри корпуса
:param latitude: Широта
:param longitude: Долгота
:return: Успешный ответ содержит объект {"status": "ok"}
:raise: ValidationError
```

*Пример запроса 1:*

Теперь, если данных с устройства (id="1") будет недостаточно, применятся настройки для вариации данных телеметрии
```json
{
    "id": "1",
    "light": {
        "min": 0,
        "max": 100
    },
    "Tamb_degC": {
        "min": 32,
        "max": 32
    },
    "latitude": {
        "min": 0,
        "max": 0.02
    },
    "longitude": {
        "min": 0,
        "max": 0.02
    }
}
```
*Пример ответа 1:*
```json
{
    "status": "ok"
}
```

#### Получение вариационных данных платформы
`GET https://localhost/api/mock`
*Пример ответа 1:*
```json
[
    {
        "id": "1",
        "light": {
            "min": 0,
            "max": 100
        },
        "Tamb_degC": {
            "min": 32,
            "max": 32
        },
        "latitude": {
            "min": 0,
            "max": 0.02
        },
        "longitude": {
            "min": 0,
            "max": 0.02
        }
    }
]
```

#### Удаление вариационных данных для устройства
`DELETE https://localhost/api/mock`
```pydocstring
:param ids: Идентификаторы устройств моков для удаления
:type ids: List[str]
:return: Успешный ответ содержит объект {"status": "ok"}
:raise: ValidationError
```
*Пример запроса 1-2:*
```json
{
    "ids": ["1"]
}
```
*Пример ответа 1:*

Успешное удаление устройства из отслеживаемых
```json
{
    "status": "ok"
}
```
*Пример ответа 2:*

ValidationError
```json
{
    "message": "Invalid JSON",
    "source": {
        "id": "99ed13d.a5152f",
        "type": "json-schema-validator",
        "name": "ValidationError",
        "count": 1
    }
}
```
### Commands
Команды для отправки на устройства, подключенных к платформе.

#### Установка команды для устройства
`POST https://localhost/api/command`
```pydocstring
:param id: Идентификатор устройства
:param auto: Флаг автономной работы устройства
:param level_light: Число для установки яркости лампы
:return: Успешный ответ содержит объект {"status": "ok"}
:raise: ValidationError
```

Если параметр auto устанавливется в:
* True - При обращении устройства к платформе, передастся команда на установку яркости
* False - Команда автоматической установки яркости на устройство. Параметр level_light - игнорируется

*Пример запроса 1:*
Выключаем питание на лампу устройства с id="1"
```json
{
    "auto": true,
    "level_light": 0,
    "id": "1"
}
```
*Пример ответа 1:*
```json
{
    "status": "ok"
}
```

### Telemetry
Команды для передачи телеметрии на платформу

#### Передача телеметрии на платформу
`POST https://localhost/api/telemetry`
```pydocstring
:param interface: Интерфейс для платформы (доступен только один - "telemetry")
:param ICCID: Идентификатор устройства
:param auto: Флаг автономной работы устройства
:param ...: Данные телеметрии с устройства
:return: Управляющая команда устройству для изменения своего поведения
:raise: ValidationError
```

*Пример запроса 1:*
```json
{
    "interface": "telemetry",
    "ICCID": "telemetries",
    "level_light": 100,
    "auto": true
}
```
*Пример ответа 1:*
```json
{
    "auto": true,
    "level_light": 100
}
```

